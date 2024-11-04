import "reflect-metadata";
import { app, httpServer } from "./app";
import { server } from "./server";
import cors from "cors";
import getUser from "./helpers/getUserFromToken";
import prisma from "./client/prisma";
import { graphqlUploadExpress } from "graphql-upload-ts";

import { expressMiddleware } from "@apollo/server/express4";
import { json, urlencoded } from "body-parser";
import express from "express";
import path from "path";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { stripeWebhookFunction } from "./webhook/stripe";

const main = async () => {
  const startedServer = await server();
  app.set("trust proxy", true);

  // Disable powered by so people do not know the technology powering the server
  app.disable("x-powered-by");
  app.use(morgan("dev"));
  app.use(cookieParser());
  await startedServer.start();
  app.post(
    "/api/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhookFunction
  );
  app.use("/public", express.static(path.join(__dirname, "..", "public")));

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://www.artbooking.art",
        "https://admin.artbooking.art",
        "http://localhost:3001",
      ],
      credentials: true,
    }),
    json(),
    graphqlUploadExpress(),

    expressMiddleware(startedServer, {
      context: async ({ req, res }) => {
        const user = await getUser(req.headers.authorization);

        return { user, token: req.headers.authorization, prisma, req, res };
      },
    })
  );

  const start = async () => {
    try {
      await new Promise<void>((resolve) =>
        httpServer.listen({ port: process.env.PORT || 8000 }, resolve)
      );
      console.log(`🚀 Server ready at http://localhost:8000/graphql`);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    httpServer,
    start,
  };
};

export default main;
