import { beforeEach, describe, expect, it } from "vitest";
import {
  EMAIL_RE,
  MIN_PASSWORD_LENGTH,
  getSession,
  hashPassword,
  isProActive,
  login,
  logout,
  register,
  setProActive,
  validateEmail,
  validatePassword,
} from "./auth";

// Minimaler localStorage-Mock für die Node-Testumgebung (auth.ts prüft
// typeof localStorage bei jedem Zugriff und nutzt ihn dann automatisch).
const store = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => (store.has(k) ? (store.get(k) as string) : null),
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: () => null,
  get length() {
    return store.size;
  },
} as Storage;

describe("validateEmail", () => {
  it("akzeptiert gültige Adressen", () => {
    expect(validateEmail("user@fudi.app")).toBeNull();
    expect(validateEmail(" test+tag@example.de ")).toBeNull();
  });

  it("lehnt leere/ungültige Adressen ab", () => {
    expect(validateEmail("")).not.toBeNull();
    expect(validateEmail("keine-mail")).not.toBeNull();
    expect(validateEmail("a@b")).not.toBeNull();
    expect(validateEmail("@example.de")).not.toBeNull();
  });

  it("EMAIL_RE und MIN_PASSWORD_LENGTH sind konsistent", () => {
    expect("x@y.de").toMatch(EMAIL_RE);
    expect(MIN_PASSWORD_LENGTH).toBe(8);
  });
});

describe("validatePassword", () => {
  it("verlangt mindestens 8 Zeichen", () => {
    expect(validatePassword("")).not.toBeNull();
    expect(validatePassword("1234567")).not.toBeNull();
    expect(validatePassword("12345678")).toBeNull();
  });
});

describe("hashPassword", () => {
  it("ist deterministisch für denselben Input", async () => {
    const a = await hashPassword("geheim123", "salz1");
    const b = await hashPassword("geheim123", "salz1");
    expect(a).toBe(b);
  });

  it("ändert sich bei anderem Passwort oder anderem Salz", async () => {
    const base = await hashPassword("geheim123", "salz1");
    expect(await hashPassword("geheim124", "salz1")).not.toBe(base);
    expect(await hashPassword("geheim123", "salz2")).not.toBe(base);
  });
});

describe("register / login / logout", () => {
  beforeEach(() => {
    store.clear();
    logout();
  });

  it("registriert ein Konto und legt eine Session an", async () => {
    const r = await register("neu@fudi.app", "sicheres123", "Anna");
    expect(r.ok).toBe(true);
    expect(r.session?.email).toBe("neu@fudi.app");
    expect(r.session?.name).toBe("Anna");
    expect(getSession()?.email).toBe("neu@fudi.app");
  });

  it("lehnt doppelte Registrierung ab", async () => {
    await register("doppelt@fudi.app", "sicheres123");
    const r2 = await register("doppelt@fudi.app", "sicheres123");
    expect(r2.ok).toBe(false);
    expect(r2.error).toContain("bereits");
  });

  it("lehnt ungültige E-Mail und kurzes Passwort ab", async () => {
    expect((await register("kaputt", "sicheres123")).ok).toBe(false);
    expect((await register("ok@fudi.app", " kurz")).ok).toBe(false);
  });

  it("login akzeptiert korrekte Zugangsdaten", async () => {
    await register("login@fudi.app", "meinpasswort");
    logout();
    expect(getSession()).toBeNull();
    const r = await login("login@fudi.app", "meinpasswort");
    expect(r.ok).toBe(true);
    expect(getSession()?.email).toBe("login@fudi.app");
  });

  it("login lehnt falsches Passwort ab", async () => {
    await register("sicher@fudi.app", "meinpasswort");
    logout();
    const r = await login("sicher@fudi.app", "falschespasswort");
    expect(r.ok).toBe(false);
    expect(r.error).toContain("Passwort");
    expect(getSession()).toBeNull();
  });

  it("login lehnt unbekannte E-Mail ab", async () => {
    const r = await login("niemand@fudi.app", "meinpasswort");
    expect(r.ok).toBe(false);
    expect(r.error).toContain("registriere");
  });

  it("Groß-/Kleinschreibung der E-Mail wird normalisiert", async () => {
    await register("Case@FUDI.app", "meinpasswort", "Ben");
    logout();
    const r = await login("case@fudi.app", "meinpasswort");
    expect(r.ok).toBe(true);
  });

  it("logout entfernt die Session", async () => {
    await register("weg@fudi.app", "meinpasswort");
    expect(getSession()).not.toBeNull();
    logout();
    expect(getSession()).toBeNull();
  });
});

describe("PRO-Status", () => {
  it("ist standardmäßig inaktiv und nur explizit setzbar", () => {
    setProActive(false);
    expect(isProActive()).toBe(false);
    setProActive(true);
    expect(isProActive()).toBe(true);
    setProActive(false);
    expect(isProActive()).toBe(false);
  });
});
