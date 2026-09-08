
import Stripe from "stripe";
import Booking from "../models/booking.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata.bookingId;

      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentMethod: "Stripe",
        status: "confirmed",
      });
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntentId = event.data.object.id;

      const sessions = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
        limit: 1,
      });

      const bookingId = sessions.data[0]?.metadata?.bookingId;

      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentMethod: "Stripe",
          status: "confirmed",
        });
      }
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};