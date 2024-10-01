
import { FRONTEND_LINK } from '@/constants/secret';
import { MyContext } from '@/server';

import { Arg, Ctx, Field, InputType, Mutation, registerEnumType, Resolver, } from 'type-graphql';
import stripeClient from '@/client/stripe';
import { paymentSessionCreateResponse } from '../class/default';

export enum productPaymentTypes {
  orderStartPrice = "orderStartPrice",
  totalprice = "totalprice",
  oneTimePayment = "oneTimePayment"
}


registerEnumType(productPaymentTypes, {
  name: "productPaymentTypes", // Mandatory
});



@InputType()
export class createCheckoutSessionargs {
  @Field(type => productPaymentTypes, { nullable: false })
  paymentType: productPaymentTypes

  @Field({ nullable: false })
  quantity: number
  @Field(type=> [String], { nullable: false })
  productIds: [string]

  @Field({ nullable: true })
  orderId?: string
}

@Resolver()
export class PaymentResolver {
  @Mutation(() => paymentSessionCreateResponse, { nullable: true })
  async createCheckoutSession(
    @Arg('input') input: createCheckoutSessionargs,

    @Ctx() ctx: MyContext,
  ): Promise<undefined | paymentSessionCreateResponse> {
    try {
      const { paymentType, quantity, productIds, } = input;
      

  

      
      const products = await ctx.prisma.product.findMany({
        where: {
          id: {
            in: productIds
          }
        }
      })

      if (products.length > 0) {

if (paymentType === productPaymentTypes.oneTimePayment) {
    
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map((product) => ({
        price_data: {
          currency: 'usd',
       
          product_data: {
            name: product.name,
            // images: images
          },
          // quantity: quantity || 1,
  
          unit_amount: (product.price * 100 * quantity) 
        },
  
      })),
      mode: 'payment',
      metadata: {
        productIds: products.map((product) => product.id).join(','),
        productPaymentType: productPaymentTypes.oneTimePayment,
      },
  
      success_url: `${FRONTEND_LINK}/order-starting/success`,
      cancel_url: `${FRONTEND_LINK}/order-starting/cancelled`,
  
    });
  
    return {
      id: session.id,
  
      message: "created", success: true
  
  
    }
  
  
}else
        if (paymentType === productPaymentTypes.orderStartPrice) {
          const session = await stripeClient.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: products.map((product) => ({
              price_data: {
                currency: 'usd',
                product_data: {
                  name: product.name,
                  // images: images
                },

                unit_amount: (product?.orderStartPrice??0) * 100 * quantity
              },
              quantity: quantity || 1,


            })),
            mode: 'payment',
            metadata: {
              productIds: products.map((product) => product.id).join(','),
              productPaymentType: productPaymentTypes.orderStartPrice,
              userId: ctx.user?.id ?? "",
            },

            success_url: `${FRONTEND_LINK}/order-starting/success`,
            cancel_url: `${FRONTEND_LINK}/order-starting/cancelled`,

          });
console.log(session);

          return {
            id: session.id,

            message: "created", success: true


          }

        } else {
     
            const order = await ctx.prisma.order.findUnique({
              where: {
                id: input.orderId
              }
            })
            if (order) {

              const session = await stripeClient.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items:  products.map((product) => ({
                  price_data: {
                    currency: 'usd',
                    product_data: {
                      name: product.name,
                      // images: images
                    },
            
                    unit_amount: (product.price * 100 * quantity) + order?.taxPrice+ order?.shippingPrice
                  },
                  quantity: quantity || 1,

            
                })),
                mode: 'payment',
                metadata: {
                  productIds: products.map((product) => product.id).join(','),
                  productPaymentType: productPaymentTypes.totalprice,
                  userId: ctx.user?.id ?? "",
                  orderId: order?.id ?? ""
                },

                success_url: `${FRONTEND_LINK}/order-fullpayment/success`,
                cancel_url: `${FRONTEND_LINK}/order-fullpayment/cancelled`,

              });
              return {
                id: session.id,

                message: "created", success: true


              }
            }

           else {
            return {

              message: "OrderId missing", success: false


            }
          }

        }

      } else {
        return {

          message: "Product Ids are missing", success: false


        }

      }
    } catch (error) {
      console.log(error);

      return {

        message: error as any, success: false


      }
    }


    // res.json({ id: session.id });


  }






}
