import { STRIPE_SECRET_KEY } from "@/constants/secret";
import Stripe from "stripe";
const stripeClient = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion:'2022-11-15',
});


export default stripeClient;