import express from 'express';
import dotenv from 'dotenv';
import stripePkg from 'stripe';
import cors from 'cors';

dotenv.config();
const app = express();
const port = process.env.PORT || 4242;
const stripe = stripePkg(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Mad Greek Racing Tee',
            },
            unit_amount: 2500,
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/success.html',
      cancel_url: 'http://localhost:3000/store.html',
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
