// import "reflect-metadata";
// import { app, httpServer } from "./app";
// import { server } from "./server";
// import cors from "cors";
// import getUser from "./helpers/getUserFromToken";
// import prisma from "./client/prisma";
// import { graphqlUploadExpress } from "graphql-upload-ts";

// import { expressMiddleware } from "@apollo/server/express4";
// import { json, urlencoded } from "body-parser";
// import express from "express";
// import path from "path";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";
// import { stripeWebhookFunction } from "./webhook/stripe";

// const main = async () => {
//   const startedServer = await server();
//   app.set("trust proxy", true);

//   // Disable powered by so people do not know the technology powering the server
//   app.disable("x-powered-by");
//   app.use(morgan("dev"));
//   app.use(cookieParser());
//   await startedServer.start();
//   app.post(
//     "/api/webhook",
//     express.raw({ type: "application/json" }),
//     stripeWebhookFunction
//   );
//   app.use("/public", express.static(path.join(__dirname, "..", "public")));
//   app.use(json({ limit: '50mb' }));

//   app.use(
//     "/graphql",
//     cors<cors.CorsRequest>({
//       origin: [
//         "http://localhost:5173",
//         "http://localhost:3000",
//         "https://www.artbooking.art",
//         "https://admin.artbooking.art",
//         "http://localhost:3001",
//       ],
//       credentials: true,
//     }),
//     graphqlUploadExpress({
//       maxFileSize: 50 * 1024 * 1024, // Set to 10 MB (adjust as needed)
//       maxFiles: 10,
//     }),
//     expressMiddleware(startedServer, {
//       context: async ({ req, res }) => {
//         const user = await getUser(req.headers.authorization);

//         return { user, token: req.headers.authorization, prisma, req, res };
//       },
//     })
//   );

//   const start = async () => {
//     try {
//       await new Promise<void>((resolve) =>
//         httpServer.listen({ port: process.env.PORT || 8000 }, resolve)
//       );
//       console.log(`🚀 Server ready at http://localhost:8000/graphql`);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return {
//     httpServer,
//     start,
//   };
// };

// export default main;

import "reflect-metadata";
import { app, httpServer } from "./app";
import { server } from "./server";
import cors from "cors";
import getUser from "./helpers/getUserFromToken";
import prisma from "./client/prisma";
import { graphqlUploadExpress } from "graphql-upload-ts";
import { expressMiddleware } from "@apollo/server/express4";
import { json } from "body-parser";
import express from "express";
import path from "path";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime";
const main = async () => {
  const startedServer = await server();
  app.set("trust proxy", true);

  // Disable powered by so people do not know the technology powering the server
  app.disable("x-powered-by");
  app.use(morgan("dev"));
  app.use(cookieParser());
  await startedServer.start();

  app.use("/assets", express.static(path.join(__dirname, "..", "public")));
  app.use(
    cors<cors.CorsRequest>({
      origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://www.artbooking.art",
        "https://admin.artbooking.art",
        "http://localhost:3001",
      ],
      credentials: true,
    })
  );

  app.use(
    "/graphql",

    graphqlUploadExpress(),
    express.json({
      limit:"50mb"
    }),
    expressMiddleware(startedServer, {
      context: async ({ req, res }) => {
        const user = await getUser(req.headers.authorization);
        return {
          user,
          token: req.headers.authorization,
          prisma: prisma as PrismaClient<
            Prisma.PrismaClientOptions,
            never,
            Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined,
            DefaultArgs
          >,
          req,
          res,
        };
      },
    })
  );

  // console.log(await parser.parseURL("https://cms.iansnews.in/admin/new-rss-feeds/health-medicine/?token=d2c35654e45cfd7071871640143fca760c00e2a2"));

  const start = async () => {
    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 8000 }, resolve)
    );
    // for now
    // await prisma.notification.deleteMany()
    console.log(`🚀 Server ready at http://localhost:${8000}/graphql`);
  };
  return {
    httpServer,
    start,
  };
};

export default main;
