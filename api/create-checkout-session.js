// api/create-checkout-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { priceId, size } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
          ...(size ? { description: `Size: ${size}` } : {}),
        },
      ],
      mode: 'payment',
      success_url: `${process.env.DOMAIN}/success.html`,
      cancel_url: `${process.env.DOMAIN}/store.html`,
    });

    res.status(200).json({ sessionId: session.id }); // ✅ Your frontend expects sessionId
  } catch (error) {
    console.error('[Stripe Checkout Error]', error);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
}
