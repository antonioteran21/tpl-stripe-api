const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  const { quantity, recurrence, product } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${product} (${recurrence})`,
            },
            unit_amount: 100, // $1.00 USD
          },
          quantity: Number(quantity),
        },
      ],
      success_url: "https://packora-design-studio.lovable.app/success",
      cancel_url: "https://packora-design-studio.lovable.app/cancel",
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
};
