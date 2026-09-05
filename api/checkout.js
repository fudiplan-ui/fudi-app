export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan = 'pro', yearly = false } = req.body || {};
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return res.status(500).json({ error: 'Stripe secret key not configured' });
  }

  // Live Price IDs for FUDI
  const PRICE_MAP = {
    pro_monthly: 'price_1UC2dSPoNfLOPXfNxxZtGTrm',
    pro_yearly: 'price_1UC2dTPoNfLOPXfNNhynoFX8',
    biz_monthly: 'price_1UC2dTPoNfLOPXfNv2TkBIKx'
  };

  const priceKey = plan === 'business' ? 'biz_monthly' : (yearly ? 'pro_yearly' : 'pro_monthly');
  const priceId = PRICE_MAP[priceKey] || PRICE_MAP.pro_monthly;

  try {
    const origin = req.headers.origin || 'https://fudi-app-psi.vercel.app';
    const params = new URLSearchParams({
      'payment_method_types[0]': 'card',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'mode': 'subscription',
      'success_url': `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&upgraded=pro`,
      'cancel_url': `${origin}/preise`
    });

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const session = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: session.error?.message || 'Stripe error' });
    }

    return res.status(200).json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
