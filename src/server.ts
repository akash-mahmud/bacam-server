

import { PrismaClient, Prisma, User, } from "@prisma/client";
import { ApolloServer } from "@apollo/server";

import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { applyMiddleware } from "graphql-middleware";
import { httpServer } from "./app";
import { resolvers } from "@generated/type-graphql";
import * as tq from 'type-graphql';


import { Request, Response } from "express";
import { DefaultArgs } from "@prisma/client/runtime";
import { AuthResolver } from "./graphql/resolver/user";
import permissions from "./graphql/permission";
import { HealthCheckResolver } from "./graphql/resolver/health";
import { MediaResolver } from "./graphql/resolver/media";
import { PaymentResolver } from "./graphql/resolver/payment";
import { OrderCustomResolver } from "./graphql/resolver/order";

export interface MyContext {
  token?: String;
  user?: User | null;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined, DefaultArgs>
  req: Request
  res: Response
}


// const server: ApolloServer<MyContext> = new ApolloServer<MyContext>({
//   schema: applyMiddleware(
//     // makeExecutableSchema({ typeDefs, resolvers }),

//     permissions
//   ),

//   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
// });


const server: () => Promise<ApolloServer<MyContext>> = async () => {


  const schema = await tq.buildSchema({
    resolvers: [...resolvers, AuthResolver, MediaResolver,

      PaymentResolver,

      OrderCustomResolver,





      HealthCheckResolver





    ], validate: true
  })




  return new ApolloServer<MyContext>({
    schema: applyMiddleware(
      schema,


      permissions
    ),
    csrfPrevention: true,

    plugins:
      [ApolloServerPluginDrainHttpServer({ httpServer }),
        // {
        //   async serverWillStart() {
        //     return {
        //       async drainServer() {
        //         await serverCleanup.dispose();
        //       },
        //     };
        //   },
        // },
      ],

  })
}
export { server };
