
import prisma from "../client/prisma";

;
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken'
import { JWT_SECRET_ACCESS_TOKEN } from "@/constants/secret";
import { IJwtPayload } from "@/graphql/class/User";

const getUser = async (
  token: any,

): Promise<User | null> => {
  const { user } = prisma;

  let loggedInuser: User | null = null;



  try {
    if (token && token.split(" ")[0] === "Bearer") {
      const authToken = token.split(" ")[1];



      const data = jwt.verify(
        authToken,
        JWT_SECRET_ACCESS_TOKEN
      ) as IJwtPayload;


      const loggedInUserData = await user.findUnique({
        where: {
          id: data.user.id,
        },
      });



      if (loggedInUserData) {
        loggedInuser = loggedInUserData;
      }
    }
  } catch (error: any) {
console.log(error);


    loggedInuser = null;
    // console.log(error.message);
  }

  return loggedInuser;
};


export default getUser