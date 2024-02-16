import stripeLib from "stripe";
import UserModel from "../models/user.js";
const stripe = stripeLib(
  "sk_test_51OjzIkL1Qo4SMbovpdDCuOhF4vTMX1gkx4l3SpmGHRCDGoK0CqmWR3s6dQiVZK2sMuF4nFfg8E0fyaexiGzbaonS00LsLMJGcq"
);

const endpointSecret =
  "whsec_a0ee93e9a5c84cb26426f0ebf472b130017037be9f7ce461f0527ff31b8ba16f";
export const webhook = async (request, response) => {
  let event = request.body;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  console.log(event);

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // const userEmail = paymentIntent?.charges?.data[0]?.billing_details?.email;
      try {
        // const user = await UserModel.findOneAndUpdate(
        //   { email: userEmail },
        //   { status: "paid" },
        //   { new: true }
        // );
        console.log("webhook working");
        // console.log("User status updated:", user);
      } catch (error) {
        console.error("Error updating user status:", error);
        return res.status(500).send("Internal Server Error");
      }
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case "payment_method.attached":
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  // response.send();
  response.send().end();
};
