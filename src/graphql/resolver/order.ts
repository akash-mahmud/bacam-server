

import { MyContext } from '@/server';

import { Args, Ctx, Query, Resolver, } from 'type-graphql';
import {
    FindManyOrderArgs, Order
} from "@generated/type-graphql";
@Resolver()
export class OrderCustomResolver {
    @Query(() => [Order])
    async myOrders(
        @Args() args: FindManyOrderArgs,

        @Ctx() ctx: MyContext,
    ): Promise<undefined | Order[]> {
        try {
            
            const data = await ctx.prisma.order.findMany({
                ...args,
                where: {
                    ...args.where,
                    userId: {
                        equals: ctx.user?.id
                    }
                },
                include:{
                    orderItem:{
                        include:{
                            product:true
                        }
                    }
                }
            })
            console.log(data[0].orderItem[0].product);
            
            return data
        } catch (error) {
            console.log(error);

            return []

        }




    }






}
