
import { rule } from "graphql-shield";
import { MyContext } from "../../server";
import { UserRole } from "@prisma/client";
export const isAuthenticated = rule({ cache: "contextual" })(
  (_: any, __: any, { user }: MyContext) => {
    return user !== null && user !== undefined;
  }
);


export const isAdmin = rule({ cache: "contextual" })(
  (_: any, __: any, { user }: MyContext) => {
    return user !== null && user !== undefined && (user.role ===UserRole.admin || user.role ===UserRole.superadmin) ;
  }
);
