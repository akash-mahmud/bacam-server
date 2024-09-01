

import { FRONTEND_LINK, JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN } from '@/constants/secret';
import { MyContext } from '@/server';
import { UserRole, UserAccountStatus } from '@prisma/client';
import { compare } from 'bcryptjs';
import stripe from 'stripe';
import { Arg, ArgsType, Ctx, Field, InputType, Mutation, registerEnumType, Resolver,   } from 'type-graphql';
import stripeClient from '@/client/stripe';
import { paymentSessionCreateResponse } from '../class/default';
import { getImage } from '@/utils/getImage';

export enum productPaymentTypes{
    orderStartPrice,
    totalprice
}


registerEnumType(productPaymentTypes, {
    name: "ProductPaymentTypes", // Mandatory
  });



@InputType()
export class createCheckoutSessionargs {
  @Field(type=> productPaymentTypes ,{ nullable: false })
  paymentType: productPaymentTypes

  @Field({ nullable: false })
  quantity: number
  @Field({ nullable: false })
  productId: string
}

@Resolver()
export class PaymentResolver {
    @Mutation(() => paymentSessionCreateResponse, { nullable: true })
    async createCheckoutSession(
        @Arg('input') input: createCheckoutSessionargs,

      @Ctx() ctx: MyContext,
    ): Promise< undefined|paymentSessionCreateResponse> {
try {
  const { paymentType, quantity , productId } = input;

  const product = await ctx.prisma.product.findUnique({
      where:{
          id:productId
      }
  })
  
  if (product?.id) {
      // const order = await ctx.prisma.order.create({
      //     data:{
      //         user:{
      //         connect:{
      //             id:ctx.user?.id??""
      //         }
      //         },
      //         itemsPrice:product.price*quantity,
      //         itemsPrePrice: product.orderStartPrice*quantity,
      //         orderItem:{
      //             create:{
      //                 qty:quantity,
      //             product:{
      //                 connect:{
      //                     id:productId
      //                 }
      //             }
      //             }
      //         }
      //     }
      // })
    const images=   product?.images?.map((img)=> getImage(img)) as string[]
    // console.log(images);
    
      if (paymentType===productPaymentTypes.orderStartPrice) {
          const session = await stripeClient.checkout.sessions.create({
              payment_method_types: ['card'],
              line_items: [
                {
                  price_data: {
                    currency: 'usd',
                    product_data: {
                      name: product.name,
                      // images: images
                    },
                    
                    unit_amount: product.orderStartPrice *100 * quantity
                  },
                  quantity: quantity || 1,
              
                  
                },
              ],
              mode: 'payment',
              metadata:{
productId: product.id,
productPaymentType :productPaymentTypes.orderStartPrice,
userId:ctx.user?.id??"",
              },

              success_url: `${FRONTEND_LINK}/order-starting/success`,
              cancel_url: `${FRONTEND_LINK}/order-starting/cancelled`,

            });

return {id:session.id,

message:"created", success:true


}

      }else{
return undefined
      }
   
  }else{
    console.log("else");
    
  }
} catch (error) {
  console.log(error);
  
  return undefined

}
       
      
        // res.json({ id: session.id });
  

    }
  
 




}
