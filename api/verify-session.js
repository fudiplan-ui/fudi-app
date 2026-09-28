/**
 * POST /api/verify-session
 * Prüft serverseitig, ob eine Stripe-Checkout-Session bezahlt wurde.
 * Nur bei "valid: true" darf das Frontend PRO aktivieren.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.body || {};
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return res.status(500).json({ valid: false, error: 'Stripe secret key not configured' });
  }

  if (!session_id || typeof session_id !== 'string' || !session_id.startsWith('cs_')) {
    return res.status(400).json({ valid: false, error: 'Ungültige Session-ID' });
  }

  try {
    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(session_id)}`,
      { headers: { Authorization: `Bearer ${stripeSecretKey}` } }
    );
    const session = await response.json();

    if (!response.ok) {
      return res.status(200).json({
        valid: false,
        error: session.error?.message || 'Session konnte nicht verifiziert werden',
      });
    }

    const paid =
      session.payment_status === 'paid' || session.payment_status === 'no_payment_required';
    const active = session.status === 'complete' && paid;

    return res.status(200).json({
      valid: active,
      plan: session.metadata?.plan || null,
      customer_email: session.customer_details?.email || null,
    });
  } catch (error) {
    return res.status(500).json({ valid: false, error: error.message || 'Internal server error' });
  }
}
