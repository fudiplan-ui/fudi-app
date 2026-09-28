import { C } from "../shared/colors";

/**
 * Impressum (§ 5 TMG / § 18 MStV).
 * TODO: Firmierung/Adresse vor dem Live-Launch durch die echten Angaben
 * des Betreibers ersetzen – Pflichtfelder für die Veröffentlichung.
 */
export default function Impressum() {

  return (
    <div className="max-w-3xl mx-auto px-5 py-12 space-y-8">
      <h1
        className="text-3xl font-black"
        style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}
      >
        Impressum
      </h1>

      <section className="space-y-2 text-sm leading-relaxed" style={{ color: C.inkMid }}>
        <h2 className="text-base font-bold" style={{ color: C.forest }}>
          Angaben gemäß § 5 TMG
        </h2>
        <p>
          FUDI Health Technologies
          <br />
          [Straße und Hausnummer]
          <br />
          [PLZ] [Ort]
          <br />
          Deutschland
        </p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed" style={{ color: C.inkMid }}>
        <h2 className="text-base font-bold" style={{ color: C.forest }}>
          Kontakt
        </h2>
        <p>
          E-Mail: <a href="mailto:kontakt@fudi.app" className="underline">kontakt@fudi.app</a>
          <br />
          Webseite: <a href="https://fudi-app-psi.vercel.app" className="underline">fudi-app-psi.vercel.app</a>
        </p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed" style={{ color: C.inkMid }}>
        <h2 className="text-base font-bold" style={{ color: C.forest }}>
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
        </h2>
        <p>
          [Vor- und Nachname des Verantwortlichen]
          <br />
          [Anschrift wie oben]
        </p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed" style={{ color: C.inkMid }}>
        <h2 className="text-base font-bold" style={{ color: C.forest }}>
          Streitschlichtung
        </h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
          <a href="https://ec.europa.eu/consumers/odr/" className="underline" rel="noopener noreferrer" target="_blank">
            https://ec.europa.eu/consumers/odr/
          </a>
          . Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed" style={{ color: C.inkMid }}>
        <h2 className="text-base font-bold" style={{ color: C.forest }}>
          Haftung für Inhalte und Links
        </h2>
        <p>
          Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen
          Gesetzen verantwortlich. FUDI bietet ausschließlich ernährungswissenschaftliche Bildungs-
          und Planungswerkzeuge. Alle Berechnungen sind modellbasierte Schätzungen und stellen
          keine medizinische Diagnose, Behandlungsempfehlung oder Ersatz für eine ärztliche
          Konsultation dar.
        </p>
      </section>
    </div>
  );
}
