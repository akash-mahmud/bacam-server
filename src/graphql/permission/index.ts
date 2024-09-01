import { isAuthenticated } from "../rules";
import { shield } from "graphql-shield";
import { IMiddlewareGenerator } from "graphql-middleware";
const permissions: IMiddlewareGenerator<any, any, any> = shield({
  Query: {
    myOrders:isAuthenticated
  },
  Mutation: {

  },
}, {allowExternalErrors: true},);

export default permissions;
