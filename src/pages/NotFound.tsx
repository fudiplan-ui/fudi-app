import { Link } from "react-router";
import { C } from "../shared/colors";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5 py-20">
      <span
        className="text-7xl font-black mb-4"
        style={{ fontFamily: "'JetBrains Mono',monospace", color: C.mint }}
      >
        404
      </span>
      <h1
        className="text-3xl font-black mb-2"
        style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}
      >
        Hier ist gerade nichts auf dem Teller.
      </h1>
      <p className="text-sm max-w-md mb-8" style={{ color: C.stone }}>
        Die gesuchte Seite existiert nicht, wurde verschoben oder du hast einen Tippfehler in der
        URL gemacht.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/"
          className="px-6 py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-95"
          style={{ background: C.forest }}
        >
          Zur Startseite
        </Link>
        <Link
          to="/rezepte"
          className="px-6 py-3 rounded-xl text-sm font-bold border transition-all hover:bg-white active:scale-95"
          style={{ borderColor: C.border, color: C.forest }}
        >
          Zu den Rezepten
        </Link>
      </div>
    </div>
  );
}
