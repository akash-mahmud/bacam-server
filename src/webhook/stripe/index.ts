/// <reference types="stripe-event-types" />

import { Request, Response } from "express";
import stripe from "../../client/stripe";
import Stripe from "stripe";
import prisma from "../../client/prisma";
import { OrderStatus } from "@prisma/client";

const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY;

export const stripeWebhookFunction = async (
  request: Request,
  response: Response
) => {
  const sig = request.headers["stripe-signature"] ?? "";

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      endpointSecret as string
    ) as Stripe.DiscriminatedEvent;
  } catch (err: any) {

    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {


case 'checkout.session.completed':
  const session = event.data.object;
  console.log(session);
  
  if (session.id) {
    
    const product = await prisma.product.findUnique({
      where:{
        id: session?.metadata?.productId 
      }
    })
     const order = await prisma.order.create({
            data:{
              status:OrderStatus.pre_payment_paid,
              
                user:{
                connect:{
                    id:session?.metadata?.userId 
                }
                },
                itemsPrePricePaymentSessionId:session.id,
                // @ts-ignore
                itemsPrice:product?.price??1*session.line_items?.data[0]?.quantity,
                // @ts-ignore
                itemsPrePrice: product?.orderStartPrice??0*session.line_items?.data[0]?.quantity,
                
                orderItem:{
                    create:{
                        qty:session.line_items?.data[0]?.quantity??1,
                    product:{
                        connect:{
                            id:session?.metadata?.productId 
                        }
                    }
                    }
                }
            }
        })

        console.log("order", order);
        
  }
  break


 
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.send();
};
