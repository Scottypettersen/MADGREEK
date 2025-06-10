const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Vercel-compatible CommonJS handler function
 */
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  console.log("[API] Incoming checkout request");
  console.log("[API] STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY);
  console.log("[API] DOMAIN:", process.env.DOMAIN);

  try {
    const { priceId, size } = req.body;

    if (!priceId) {
      console.error("[API ERROR] Missing priceId");
      return res.status(400).json({ error: 'Missing priceId' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
          ...(size ? { description: `Size: ${size}` } : {})
        }
      ],
      mode: 'payment',
      success_url: `${process.env.DOMAIN}/success.html`,
      cancel_url: `${process.env.DOMAIN}/store.html`
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error('[Stripe Checkout Error]', err);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
};
