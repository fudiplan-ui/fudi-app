import { Component, type ErrorInfo, type ReactNode } from "react";
import { C } from "../shared/colors";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Fangt Runtime-Fehler der React-Seiten ab, damit Nutzer nie eine weiße
 * Seite sehen. Die Fehlermeldung wird anonymisiert geloggt (keine personen-
 * bezogenen Daten im Klartext).
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || "Unbekannter Fehler" };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[FUDI] Render-Fehler:", error, info.componentStack);
  }

  handleReload = (): void => {
    window.location.href = "/";
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{ background: C.cream }}
      >
        <span
          className="text-6xl font-black mb-4"
          style={{ fontFamily: "'JetBrains Mono',monospace", color: C.coral }}
        >
          !
        </span>
        <h1
          className="text-2xl font-black mb-2"
          style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}
        >
          Etwas ist schiefgelaufen.
        </h1>
        <p className="text-sm max-w-md mb-6" style={{ color: C.stone }}>
          Ein unerwarteter Fehler ist aufgetreten. Deine Daten sind nicht verloren – starte die
          App bitte neu.
        </p>
        <p
          className="text-[11px] font-mono mb-6 px-3 py-2 rounded-lg max-w-md break-all"
          style={{ background: C.white, color: C.inkSoft, border: `1px solid ${C.border}` }}
        >
          {this.state.message}
        </p>
        <button
          onClick={this.handleReload}
          className="px-6 py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-95"
          style={{ background: C.forest }}
        >
          Neustart →
        </button>
      </div>
    );
  }
}
