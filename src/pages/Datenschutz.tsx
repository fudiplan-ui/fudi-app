import { C } from "../shared/colors";

/**
 * Datenschutzerklärung (DSGVO).
 * TODO: Vor dem Live-Launch juristisch prüfen lassen; Hosting-Verantwortlicher
 * (Vercel Inc.) und Zahlungsdienstleister (Stripe) sind bereits ergänzt.
 */
export default function Datenschutz() {

  const h2 = "text-base font-bold";
  const p = "text-sm leading-relaxed";

  return (
    <div className="max-w-3xl mx-auto px-5 py-12 space-y-8" style={{ color: C.inkMid }}>
      <h1
        className="text-3xl font-black"
        style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}
      >
        Datenschutzerklärung
      </h1>

      <section className="space-y-2">
        <h2 className={h2} style={{ color: C.forest }}>1. Verantwortlicher</h2>
        <p className={p}>
          FUDI Health Technologies, [Straße und Hausnummer], [PLZ] [Ort], E-Mail:
          kontakt@fudi.app. Verantwortlicher ist die natürliche oder juristische Person, die
          allein oder gemeinsam mit anderen über Zwecke und Mittel der Verarbeitung
          personenbezogener Daten entscheidet.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className={h2} style={{ color: C.forest }}>2. Welche Daten wir verarbeiten</h2>
        <ul className={`${p} list-disc pl-5 space-y-1`}>
          <li>
            <b>Kontodaten:</b> E-Mail-Adresse, Anzeigename, Passwort-Hash – ausschließlich zur
            Anmeldung und Kontoverwaltung.
          </li>
          <li>
            <b>Gesundheits- und Ernährungsdaten (freiwillig):</b> Blutzuckertagebuch,
            Ernährungsprofil, Allergien, Zielgewicht. Diese Daten verarbeiten wir nur mit deiner
            ausdrücklichen Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) und behandeln sie als Daten
            besonderer Kategorien (Art. 9 DSGVO).
          </li>
          <li>
            <b>Zahlungsdaten:</b> Verarbeitung erfolgt durch Stripe (Stripe Payments Europe Ltd.).
            Wir speichern keine Kreditkartennummern – lediglich den Status deines Abos.
          </li>
          <li>
            <b>Technische Daten:</b> IP-Adresse, Browsertyp, Zugriffszeitpunkte (Server-Logs des
            Hosters Vercel Inc., USA, im Rahmen des Art. 28 DSGVO-Auftragsverarbeitungsvertrags).
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className={h2} style={{ color: C.forest }}>3. Zwecke und Rechtsgrundlagen</h2>
        <p className={p}>
          Verarbeitung zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO) für Kontofunktion und
          Abrechnung, aufgrund deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) für personalisierte
          Ernährungsempfehlungen sowie zur Wahrung berechtigter Interessen (Art. 6 Abs. 1 lit. f
          DSGVO) für Sicherheit und Missbrauchsschutz.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className={h2} style={{ color: C.forest }}>4. Speicherung im Browser</h2>
        <p className={p}>
          Ein Teil deiner Daten (Profil, Tagebuch, Wochenplan, Einkaufsliste) wird aktuell lokal in
          deinem Browser gespeichert (localStorage). Diese Daten verlassen dein Gerät nicht und
          werden beim Löschen deines Browser-Verzeichnisses entfernt. Sie sind durch keinen
          Zugriffsschutz auf dem Gerät geschützt – empfohlen ist die Nutzung nur auf privaten
          Geräten.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className={h2} style={{ color: C.forest }}>5. Deine Rechte</h2>
        <p className={p}>
          Dir stehen zu: Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17),
          Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie das
          Widerrufsrecht erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO). Zudem besteht ein
          Beschwerderecht bei einer Aufsichtsbehörde (Art. 77 DSGVO). Zur Ausübung genügt eine
          Nachricht an kontakt@fudi.app.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className={h2} style={{ color: C.forest }}>6. Aufbewahrung und Löschung</h2>
        <p className={p}>
          Kontodaten speichern wir bis zur Löschung deines Kontos. Gesundheitsdaten löschen wir,
          sobald du dein Konto löschst oder die Einwilligung widerrufst, sofern keine
          gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className={h2} style={{ color: C.forest }}>7. Externe Dienste</h2>
        <ul className={`${p} list-disc pl-5 space-y-1`}>
          <li><b>Vercel</b> – Hosting und Auslieferung der Webanwendung (USA).</li>
          <li><b>Stripe</b> – Abwicklung der Zahlungen (Stripe Payments Europe Ltd., Irland).</li>
          <li>
            <b>Unsplash</b> – Auslieferung redaktioneller Food-Bilder (Unsplash Inc., Kanada).
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className={h2} style={{ color: C.forest }}>8. Aktualität</h2>
        <p className={p}>
          Stand: September 2026. Wir passen diese Erklärung an, sobald sich Funktionen oder
          rechtliche Rahmenbedingungen ändern.
        </p>
      </section>
    </div>
  );
}
