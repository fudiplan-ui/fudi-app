/**
 * FUDI Auth-Modul
 *
 * HINWEIS: Lokaler Auth-Layer (localStorage), damit die App ohne Backend
 * vollständig funktioniert. Für den Produktivbetrieb wird er durch Supabase
 * Auth ersetzt (siehe FUDI_Rethink 2.0) – die public API
 * (login/register/logout/getSession) bleibt identisch.
 */

export interface StoredUser {
  email: string;
  name: string;
  salt: string;
  pwHash: string;
  createdAt: string;
}

export interface Session {
  email: string;
  name: string;
  loginAt: string;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
  session?: Session;
}

const USERS_KEY = "fudi_users";
const SESSION_KEY = "fudi_session";

// In-Memory-Fallback (SSR / private modes / Tests ohne localStorage)
const memoryStore = new Map<string, string>();

function safeGet(key: string): string | null {
  try {
    if (typeof localStorage !== "undefined") return localStorage.getItem(key);
  } catch {
    /* storage blockiert */
  }
  return memoryStore.get(key) ?? null;
}

function safeSet(key: string, value: string): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
      return;
    }
  } catch {
    /* storage blockiert */
  }
  memoryStore.set(key, value);
}

function safeRemove(key: string): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
      return;
    }
  } catch {
    /* storage blockiert */
  }
  memoryStore.delete(key);
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MIN_PASSWORD_LENGTH = 8;

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return "Bitte gib deine E-Mail-Adresse ein.";
  if (!EMAIL_RE.test(trimmed)) return "Die E-Mail-Adresse ist nicht gültig.";
  return null;
}

export function validatePassword(pw: string): string | null {
  if (!pw) return "Bitte gib ein Passwort ein.";
  if (pw.length < MIN_PASSWORD_LENGTH)
    return `Das Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein.`;
  return null;
}

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < bytes; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** SHA-256 (Hex) über Salz + Passwort. */
export async function hashPassword(pw: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${pw}`);
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Deterministischer Fallback (Umgebungen ohne SubtleCrypto)
  let h1 = 0x811c9dc5;
  let h2 = 0x1000193;
  for (const byte of data) {
    h1 = Math.imul(h1 ^ byte, 0x01000193);
    h2 = Math.imul(h2 + byte, 0x85ebca6b);
  }
  return (h1 >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0");
}

function readUsers(): StoredUser[] {
  try {
    const raw = safeGet(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  safeSet(USERS_KEY, JSON.stringify(users));
}

/** Neues Konto anlegen. Existiert die E-Mail bereits, ist das ein Fehler. */
export async function register(email: string, password: string, name?: string): Promise<AuthResult> {
  const emailError = validateEmail(email);
  if (emailError) return { ok: false, error: emailError };
  const pwError = validatePassword(password);
  if (pwError) return { ok: false, error: pwError };

  const normalized = email.trim().toLowerCase();
  const users = readUsers();
  if (users.some((u) => u.email === normalized)) {
    return { ok: false, error: "Für diese E-Mail-Adresse existiert bereits ein Konto." };
  }

  const salt = randomHex(16);
  const pwHash = await hashPassword(password, salt);
  const displayName = name?.trim() || normalized.split("@")[0];

  users.push({
    email: normalized,
    name: displayName,
    salt,
    pwHash,
    createdAt: new Date().toISOString(),
  });
  writeUsers(users);

  const session: Session = { email: normalized, name: displayName, loginAt: new Date().toISOString() };
  safeSet(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}

/** Konto prüfen und Session anlegen. */
export async function login(email: string, password: string): Promise<AuthResult> {
  const emailError = validateEmail(email);
  if (emailError) return { ok: false, error: emailError };
  if (!password) return { ok: false, error: "Bitte gib dein Passwort ein." };

  const normalized = email.trim().toLowerCase();
  const user = readUsers().find((u) => u.email === normalized);
  if (!user) {
    return { ok: false, error: "Unbekannte E-Mail-Adresse. Bitte registriere dich zuerst." };
  }

  const pwHash = await hashPassword(password, user.salt);
  if (pwHash !== user.pwHash) {
    return { ok: false, error: "Das Passwort stimmt nicht." };
  }

  const session: Session = { email: user.email, name: user.name, loginAt: new Date().toISOString() };
  safeSet(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}

/** Aktuelle Session (null = nicht eingeloggt). */
export function getSession(): Session | null {
  try {
    const raw = safeGet(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    return s && typeof s.email === "string" ? s : null;
  } catch {
    return null;
  }
}

export function logout(): void {
  safeRemove(SESSION_KEY);
}

// ── PRO-Status (nur nach erfolgreicher Stripe-Verifikation setzbar) ──
const PRO_KEY = "fudi_pro_active";

export function isProActive(): boolean {
  return safeGet(PRO_KEY) === "true";
}

export function setProActive(active: boolean): void {
  if (active) safeSet(PRO_KEY, "true");
  else safeRemove(PRO_KEY);
}
