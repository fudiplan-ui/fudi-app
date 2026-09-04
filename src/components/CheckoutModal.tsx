import React, { useState } from "react";
import { C } from "../shared/colors";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  priceMonthly: number;
  priceYearly: number;
  yearly: boolean;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  planName,
  priceMonthly,
  priceYearly,
  yearly,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const currentPrice = yearly ? priceYearly : priceMonthly;

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      localStorage.setItem("fudi_pro_active", "true");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border"
        style={{ borderColor: C.border }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-center justify-between text-white"
          style={{ background: C.forest }}
        >
          <div>
            <span className="text-xs uppercase tracking-wider font-bold opacity-75">
              Sicheres Checkout
            </span>
            <h2 className="font-bold text-lg">FUDI {planName} Upgrade</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {!success ? (
            <>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm" style={{ color: C.forest }}>
                    {planName} Plan ({yearly ? "Jährliche Abrechnung" : "Monatlich kündbar"})
                  </p>
                  <p className="text-xs" style={{ color: C.stone }}>
                    14 Tage unverbindliche Testphase inklusive
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black" style={{ color: C.forest }}>
                    {currentPrice.toFixed(2).replace(".", ",")} €
                  </p>
                  <p className="text-[10px]" style={{ color: C.stone }}>
                    {yearly ? "pro Monat (jährl.)" : "pro Monat"}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs" style={{ color: C.stone }}>
                <p className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> Sofortiger Zugriff auf Blutzucker-Vorhersage & KI-Planer
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> Jederzeit mit einem Klick kündbar
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> Verschlüsselte Zahlung über Stripe
                </p>
              </div>

              {/* Stripe Payment simulation */}
              <div className="pt-2">
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center gap-2 text-blue-900 text-xs mb-3">
                  <span className="font-bold">🔒 Stripe Testumgebung:</span>
                  <span>Keine echte Belastung notwendig.</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-md transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ background: C.forest }}
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    `Jetzt 14 Tage kostenlos testen (${currentPrice.toFixed(2).replace(".", ",")} €/Mo)`
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center text-2xl text-green-600">
                ✓
              </div>
              <h3 className="font-bold text-lg" style={{ color: C.forest }}>
                Willkommen bei FUDI {planName}!
              </h3>
              <p className="text-xs" style={{ color: C.stone }}>
                Dein Account wurde erfolgreich freigeschaltet. Alle KI-Funktionen und Blutzucker-Analysen stehen dir ab sofort zur Verfügung.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl font-bold text-white text-xs"
                style={{ background: C.forest }}
              >
                Zum Dashboard ➔
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
