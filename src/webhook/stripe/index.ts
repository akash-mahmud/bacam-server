/// <reference types="stripe-event-types" />

import { Request, Response } from "express";
import stripe from "../../client/stripe";
import Stripe from "stripe";
import prisma from "../../client/prisma";
import { OrderStatus } from "@prisma/client";
import { productPaymentTypes } from "@/graphql/resolver/payment";

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

        const productIds = session?.metadata?.productIds.split(",")


        const purchasedProducts = await prisma.cartItem.findMany({
          where: {
            cart: {
              userId: session?.metadata?.userId
            },
            productId: {
              in: productIds
            }
          },
          include: {
            product: true
          }
        })

        if (session?.metadata?.productPaymentType === productPaymentTypes.oneTimePayment) {


          const order = await prisma.order.create({
            data: {
              status: OrderStatus.one_time_payment_success,

              user: {
                connect: {
                  id: session?.metadata?.userId
                }
              },
              itemsTotalPricePaymentSessionId: session.id,
              itemsPrice: purchasedProducts.map((data) => data.product.price * data.quantity).reduce((acum, cur) => acum + cur, 0) ?? 0,


              orderItem: {
                createMany: {
                  data: purchasedProducts?.map((curElem, idx) => ({
                    qty: curElem.quantity ?? 1,
                    productId: curElem.product.id
                  })) ?? []
                }

              }
            }
          })
          console.log("order", order);
          await prisma.cartItem.deleteMany({
            where: {
              cart: {
                userId: {
                  equals: session?.metadata?.userId
                }
              },
              product: {
                id: {
                  in: productIds
                }
              }
            }
          })
          break
        }
        const products = await prisma.product.findMany({
          where: {
            id: {
              in: productIds
            }
          }
        })

        if (session?.metadata?.productPaymentType === productPaymentTypes.orderStartPrice) {

          const order = await prisma.order.create({
            data: {
              status: OrderStatus.pre_payment_paid,

              user: {
                connect: {
                  id: session?.metadata?.userId
                }
              },
              itemsPrePricePaymentSessionId: session.id,
              // @ts-ignore
              itemsPrice: products[0]?.price ?? 1 * session.line_items?.data[0]?.quantity,
              // @ts-ignore

              itemsPrePrice: products[0]?.orderStartPrice ?? 0 * session.line_items?.data[0]?.quantity,

              orderItem: {
                create: {
                  qty: session.line_items?.data[0]?.quantity ?? 1,
                  product: {
                    connect: {
                      id: products[0].id
                    }
                  }
                }
              }
            }
          })

          console.log("order", order);
          await prisma.cartItem.deleteMany({
            where: {
              cart: {
                userId: {
                  equals: session?.metadata?.userId
                }
              },
              product: {
                id: {
                  in: productIds
                }
              }
            }
          })
          break
        } else {
          const order = await prisma.order.update({
            where: {
              id: session?.metadata?.orderId
            },
            data: {
              status: {
                set: OrderStatus.full_payment_success
              },
              itemsTotalPricePaymentSessionId: {
                set: session.id
              }
            }
          })
          console.log("order", order);
          await prisma.cartItem.deleteMany({
            where: {
              cart: {
                userId: {
                  equals: session?.metadata?.userId
                }
              },
              product: {
                id: {
                  in: productIds
                }
              }
            }
          })
          break
        }


      }
      break



    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.send();
};
