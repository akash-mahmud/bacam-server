

import { Resolver, Mutation, Arg, Ctx,  ArgsType, Field, Query,  } from 'type-graphql';
import { compare, hash } from 'bcryptjs';
import {
  User, UserCreateInput,  UserRole, UserAccountStatus,
} from "@generated/type-graphql";
import jwt from "jsonwebtoken";

import { JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN, JWT_SECRET_EMAIL_VERIFY_TOKEN, FRONTEND_LINK, JWT_SECRET_FORGET_PASSWORD_TOKEN } from '@/constants/secret';
import sendEmailWithBackgroundTask from '@/email/send';
import { MyContext } from '@/server';
import { LoginResponsce, UserForResponsce, CreateOneUserArgsCustom, ReesetPassByLinkInput, UpdateOneUserArgsCustom, UpdateProfilePaswordArgs, IJwtPayload } from '../class/User';
import { defaultResponsce } from '../class/default';

@ArgsType()
export class customTypeForUserUpdate {
  @Field({ nullable: true })
  oldPassword: string
  @Field({ nullable: true })
  updatePass: Boolean
  @Field({ nullable: true })
  newPass: String
}
@Resolver()
export class AuthResolver {

  // ? Public users

  @Mutation(() => LoginResponsce, { nullable: true })
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext,
  ): Promise<LoginResponsce | null> {
    const user = await ctx.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }


    // if (user.status === UserAccountStatus.verify_email) {
    //   throw new Error('Verify your email first');

    // }



    const selectedUserData: UserForResponsce = {
      firstname: user.firstname,
      id: user.id,
      lastname: user.lastname,
      email: user.email,
      role: user.role as UserRole,
      status: user.status  as UserAccountStatus,
      phoneNumber:ctx.user?.phoneNumber??'',
      avater: ctx.user?.avater??""


    }
    const token = jwt.sign(
      {
        user: {
          id: user.id,

          email: user.email,
        },
      },
      JWT_SECRET_ACCESS_TOKEN as string,
      {
        algorithm: "HS256",
        subject: user.id,
        expiresIn: "1min",
        // expiresIn: Math.floor(Date.now() / 1000) + 20
      }
    );
    const refreshToken = jwt.sign({
      user: {
        id: user.id,

        email: user.email,
      },
    }, JWT_SECRET_REFRESH_TOKEN as string, {
      expiresIn: '1d', // Set a longer expiration time for the refresh token
      algorithm: "HS256",
      subject: user.id,

    });

    ctx.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,

    })
    return {
      message: "success",
      accessToken: token,
      isAuthenticated: true,
      success: true,
      user: selectedUserData,
    };
    // return user;
  }

  @Mutation(() => defaultResponsce, { nullable: true })
  async register(
    @Arg('input') input: CreateOneUserArgsCustom,
    @Ctx() ctx: MyContext
  ): Promise<defaultResponsce | null> {
    try {

      const { email, password } = input
      const user = await ctx.prisma.user.findUnique({ where: { email } });


      if (user) {
        throw new Error('User already exist');
      }

      const hashedPassword = await hash(password, 10)
      input.password = hashedPassword
      const userInput: UserCreateInput = { ...input, role: 'public', }
      // const stripeCustomer = await createCustomer({
      //   email: userInput.email,
      //   name: `${userInput.firstname} ${userInput.lastname}`
      // })
      // if (stripeCustomer?.id) {
      const createdUser = await ctx.prisma.user.create({
        data: {
          ...userInput, status: UserAccountStatus.verify_email, role: UserRole.public
        }

      })
      const token = jwt.sign(
        {},
        JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
        {
          algorithm: "HS256",
          subject: createdUser.id,
          expiresIn: "1d",
        }
      );

      await ctx.prisma.userTokens.create({
        data: {
          token,
          userId: createdUser.id
        }
      })
      sendEmailWithBackgroundTask({
        subject: "Verify your email",

        to: createdUser.email
      }, {
        name: 'EmailVerifyLink.hbs',
        templateVariables: {
          link: `${FRONTEND_LINK}/verifyemail?token=${token}`
        },

      })
      // } else {
      //   return {
      //     message: 'Something went wrong',
      //     success: false
      //   };
      // }




      return {
        message: 'Success. Verification mail has been sent on your email',
        success: true
      };
    } catch (error: any) {
      return {
        message: error.message,
        success: false
      };
    }

  }

// ? Admin Users


@Mutation(() => LoginResponsce, { nullable: true })
async adminLogin(
  @Arg('email') email: string,
  @Arg('password') password: string,
  @Ctx() ctx: MyContext,
): Promise<LoginResponsce | null> {
  try {
    const user = await ctx.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return{
        message: "Invalid email or password",
        isAuthenticated: false,
        success: false,
      }
    }
    if (!(user.role === UserRole.admin || user.role === UserRole.superadmin)) {
      return{
        message: "You can't login here",
        isAuthenticated: false,
        success: false,
      }
  
    }
    const isPasswordValid = await compare(password, user.password);
  
    if (!isPasswordValid) {
      return{
        message: "Invalid email or password",
        isAuthenticated: false,
        success: false,
      }    }
    if (user.status === UserAccountStatus.verify_email) {
      return{
        message: "Verify your email first",
        isAuthenticated: false,
        success: false,
      }
  
    }
  
    const selectedUserData: UserForResponsce = {
      firstname: user.firstname,
      id: user.id,
      lastname: user.lastname,
      email: user.email,
      role: user.role as UserRole,
      status: user.status as UserAccountStatus,
      phoneNumber:ctx.user?.phoneNumber ??"",
      avater: ctx.user?.avater??""
  
  
    }
    const token = jwt.sign(
      {
        user: {
          id: user.id,
  
          email: user.email,
        },
      },
      JWT_SECRET_ACCESS_TOKEN as string,
      {
        algorithm: "HS256",
        subject: user.id,
        expiresIn: "1min",
        // expiresIn: Math.floor(Date.now() / 1000) + 20
      }
    );
    const refreshToken = jwt.sign({
      user: {
        id: user.id,
  
        email: user.email,
      },
    }, JWT_SECRET_REFRESH_TOKEN as string, {
      expiresIn: '1d', // Set a longer expiration time for the refresh token
      algorithm: "HS256",
      subject: user.id,
  
    });
  
    ctx.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
  
    })
    return {
      message: "success",
      accessToken: token,
      isAuthenticated: true,
      success: true,
      user: selectedUserData,
    };
  } catch (error) {
    console.log(error);
    return{
      message: "Something went wrong",
      isAuthenticated: false,
      success: false,
    }
    
  }

  // return user;
}

@Mutation(() => defaultResponsce, { nullable: true })
async adminRegister(
  @Arg('input') input: CreateOneUserArgsCustom,
  @Ctx() ctx: MyContext
): Promise<defaultResponsce | null> {
  try {

    if (!(ctx.user?.role=== UserRole.superadmin)) {
      throw new Error("You can't create new admins");
    }
    const { email, password } = input
    const user = await ctx.prisma.user.findUnique({ where: { email } });


    if (user) {
      throw new Error('User already exist');
    }

    const hashedPassword = await hash(password, 10)
    input.password = hashedPassword
    const userInput: UserCreateInput = { ...input, role: 'public', }
    // const stripeCustomer = await createCustomer({
    //   email: userInput.email,
    //   name: `${userInput.firstname} ${userInput.lastname}`
    // })
    // if (stripeCustomer?.id) {
    const createdUser = await ctx.prisma.user.create({
      data: {
        ...userInput, status: UserAccountStatus.verify_email, role: UserRole.public
      }

    })
    const token = jwt.sign(
      {},
      JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      {
        algorithm: "HS256",
        subject: createdUser.id,
        expiresIn: "1d",
      }
    );

    await ctx.prisma.userTokens.create({
      data: {
        token,
        userId: createdUser.id
      }
    })
    sendEmailWithBackgroundTask({
      subject: "Verify your email",

      to: createdUser.email
    }, {
      name: 'EmailVerifyLink.hbs',
      templateVariables: {
        link: `${FRONTEND_LINK}/verifyemail?token=${token}`
      },

    })
    // } else {
    //   return {
    //     message: 'Something went wrong',
    //     success: false
    //   };
    // }




    return {
      message: 'Success. Verification mail has been sent on your email',
      success: true
    };
  } catch (error: any) {
    return {
      message: error.message,
      success: false
    };
  }

}

  @Mutation(() => String, { nullable: true })
  async refreshToken(
    @Ctx() ctx: MyContext,



  ): Promise<string | null> {
    try {
      const refreshToken = ctx.req.cookies?.refreshToken
      if (!refreshToken) {
        return 'unathorized'
      }



      const decoded = jwt.verify(refreshToken, JWT_SECRET_REFRESH_TOKEN as string) as IJwtPayload;

      const accessToken = jwt.sign(
        {
          user: {
            id: decoded.user.id,

            email: decoded.user.email,
          },
        },
        JWT_SECRET_ACCESS_TOKEN as string,
        {
          algorithm: "HS256",
          subject: decoded.user.id,
          expiresIn: "1min",
        }
      );
      return accessToken
    } catch (error: any) {
      console.log( "Error from refreshtoken mutation",error.message);
      ctx.res.clearCookie('refreshToken')

      return 'expired';
    }
  }
  @Mutation(() => defaultResponsce, { nullable: true })
  async logout(
    @Ctx() ctx: MyContext,



  ): Promise<defaultResponsce | null> {
    ctx.res.clearCookie('refreshToken')
    return {
      success: true,
      message: 'sucess'
    }
  }




  @Mutation(() => defaultResponsce, { nullable: true })
  async updateProfile(
    @Arg('input') args: UpdateOneUserArgsCustom,
    @Arg('passwordInput') passwordArgs: UpdateProfilePaswordArgs,

    @Ctx() ctx: MyContext
  ): Promise<defaultResponsce | null> {
    try {


if (passwordArgs.updatePassword) {
  const isPasswordValid = await compare(passwordArgs.oldPassword, ctx?.user?.password??"");
  if (isPasswordValid) {
                        const hashedPassword = await hash(passwordArgs.newPassword as string, 10)

    await ctx.prisma.user.update({
      where:{
        id: ctx.user?.id
      },
      data:{
        password:{
          set:hashedPassword
        }
      }
  
    })
    return {
      message: 'success',
      success: true
    };
  }else{
    return {
      message: 'Old password is wrong',
      success: false
    };
  }
}else{
  let updateInput:UpdateOneUserArgsCustom = args

  Object.keys(args).map((key)=> {
    // @ts-ignore
    updateInput[key] = {
      // @ts-ignore
      set:args[key]
    }
  })
  console.log(updateInput);

  await ctx.prisma.user.update({
    where:{
      id: ctx.user?.id
    },
    data:updateInput

  })
  return {
    message: 'success',
    success: true
  };
}









    } catch (error: any) {
      return {
        message: error.message,
        success: false
      };
    }

  }

  // @Mutation(() => defaultResponsce, { nullable: true })
  // async addPaymentMethod(
  //   @Arg('token') token: string,
  //   @PubSub() pubSub: PubSubEngine,

  //   @Ctx() ctx: MyContext
  // ): Promise<defaultResponsce | null> {
  //   try {
  //     const userData = await ctx.prisma.user.findUnique({
  //       where: {
  //         id: ctx.user?.id
  //       },
  //       select: {
  //         customer_Id: true,
  //       },
  //     });

  //     if (userData?.customer_Id) {
  //       const res = await addPayment(token, userData?.customer_Id);
  //       if (res.success) {
  //         const paymentMethodaddedUser = await ctx.prisma.user.update({
  //           where: {
  //             id: ctx.user?.id
  //           },
  //           data: {
  //             status: {
  //               set: UserAccountStatus.plan_subscription_needed
  //             }
  //           }
  //         })
  //         await ctx.prisma.notification.create({
  //           data: {
  //             text: 'Payment method added',
  //             user: {
  //               connect: {
  //                 id: paymentMethodaddedUser.id
  //               }
  //             }
  //           }
  //         })

  //         return {
  //           message: 'success',
  //           success: true
  //         }
  //       } else {

  //         return {
  //           message: 'failed',
  //           success: false
  //         }
  //       }
  //     } else {
  //       return {
  //         message: 'failed',
  //         success: false
  //       }
  //     }









  //   } catch (error: any) {
  //     return {
  //       message: error.message,
  //       success: false
  //     };
  //   }

  // }
  // @Mutation(() => defaultResponsce, { nullable: true })
  // async changePaymentMethod(
  //   @Arg('token') token: string,
  //   @PubSub() pubSub: PubSubEngine,

  //   @Ctx() ctx: MyContext
  // ): Promise<defaultResponsce | null> {
  //   try {
  //     const userData = await ctx.prisma.user.findUnique({
  //       where: {
  //         id: ctx.user?.id
  //       },
  //       select: {
  //         customer_Id: true,
  //       },
  //     });

  //     if (userData?.customer_Id) {
  //       const res = await addPayment(token, userData?.customer_Id);
  //       if (res.success) {

  //         // await ctx.prisma.notification.create({
  //         //   data: {
  //         //     text: 'Payment method changed',
  //         //     user: {
  //         //       connect: {
  //         //         id: ctx?.user?.id
  //         //       }
  //         //     }
  //         //   }
  //         // })

  //         return {
  //           message: 'success',
  //           success: true
  //         }
  //       } else {

  //         return {
  //           message: 'failed',
  //           success: false
  //         }
  //       }
  //     } else {
  //       return {
  //         message: 'failed',
  //         success: false
  //       }
  //     }









  //   } catch (error: any) {
  //     return {
  //       message: error.message,
  //       success: false
  //     };
  //   }

  // }
  @Mutation(() => defaultResponsce, { nullable: true })
  async verifyEmail(
    @Arg('token') token: string,

    @Ctx() ctx: MyContext
  ): Promise<defaultResponsce | null> {
    try {
      const data = jwt.verify(
        token,
        JWT_SECRET_EMAIL_VERIFY_TOKEN as string
      )
      if (typeof data !== 'string') {
        const tokenAvialable = await ctx.prisma.userTokens.findUnique({
          where: {
            token: token
          }
        })
        if (tokenAvialable && tokenAvialable.userId) {

          if (data.sub) {
            const userExist = await ctx.prisma.user.findUnique({
              where: {
                id: tokenAvialable.userId
              }
            })
            if (userExist && userExist.id === data.sub) {

              await ctx.prisma.user.update({
                where: {
                  id: data.sub
                },
                data: {
                  status: {
                    set: UserAccountStatus.payment_method_needed
                  }
                }
              })
              await ctx.prisma.userTokens.delete({
                where: {
                  token: token
                }
              })
              return {
                message: 'Verified',
                success: true
              }
            } else {
              return {
                message: 'Invalid request',
                success: false
              }
            }



          } else {
            return {
              message: 'Invalid request',
              success: false
            }
          }
        } else {
          return {
            message: 'Invalid request',
            success: false
          }
        }
      } else {
        return {
          message: data,
          success: false
        }
      }










    } catch (error: any) {
      return {
        message: error.message,
        success: false
      };
    }

  }

  @Mutation(() => defaultResponsce, { nullable: true })
  async forgetPassword(
    @Arg('email',) email: string,

    @Ctx() ctx: MyContext
  ): Promise<defaultResponsce | null> {
    try {

      const userData = await ctx.prisma.user.findUnique({
        where: {
          email
        }
      })
      if (userData) {
        const token = jwt.sign(
          {},
          JWT_SECRET_FORGET_PASSWORD_TOKEN as string,
          {
            algorithm: "HS256",
            subject: userData.id,
            expiresIn: "1d",
          }
        );

        await ctx.prisma.userTokens.create({
          data: {
            token,
            userId: userData.id
          }
        })
        await sendEmailWithBackgroundTask({
          subject: "Reset your password",

          to: userData.email
        }, {
          name: 'ForgetPassword.hbs',
          templateVariables: {
            link: `${FRONTEND_LINK}/reset-password?token=${token}`
          },

        })
        return {
          message: "We have sent you an email",
          success: true
        }
      } else {
        return {
          message: "Email doesn't exist",
          success: false
        }
      }










    } catch (error: any) {
      return {
        message: error.message,
        success: false
      };
    }

  }

  @Mutation(() => defaultResponsce, { nullable: true })
  async passwordResetTokenVerify(
    @Arg('token') token: string,

    @Ctx() ctx: MyContext
  ): Promise<defaultResponsce | null> {
    try {
      const data = jwt.verify(
        token,
        JWT_SECRET_FORGET_PASSWORD_TOKEN as string
      )
      if (typeof data !== 'string') {
        const tokenAvialable = await ctx.prisma.userTokens.findUnique({
          where: {
            token: token
          }
        })
        if (tokenAvialable && tokenAvialable.userId) {

          if (data.sub) {
            const userExist = await ctx.prisma.user.findUnique({
              where: {
                id: tokenAvialable.userId
              }
            })
            if (userExist && userExist.id === data.sub) {


              return {
                message: 'Verified',
                success: true
              }
            } else {
              return {
                message: 'Invalid request',
                success: false
              }
            }



          } else {
            return {
              message: 'Invalid request',
              success: false
            }
          }
        } else {
          return {
            message: 'Invalid request',
            success: false
          }
        }
      } else {
        return {
          message: data,
          success: false
        }
      }










    } catch (error: any) {
      return {
        message: error.message,
        success: false
      };
    }

  }


  @Mutation(() => defaultResponsce, { nullable: true })
  async resetPassByVerficationLink(
    @Arg('input') input: ReesetPassByLinkInput,

    @Ctx() ctx: MyContext
  ): Promise<defaultResponsce | null> {
    try {
      const data = jwt.verify(
        input.token,
        JWT_SECRET_FORGET_PASSWORD_TOKEN as string
      )
      if (typeof data !== 'string') {
        const tokenAvialable = await ctx.prisma.userTokens.findUnique({
          where: {
            token: input.token
          }
        })
        if (tokenAvialable && tokenAvialable.userId) {

          if (data.sub) {
            const userExist = await ctx.prisma.user.findUnique({
              where: {
                id: tokenAvialable.userId
              }
            })
            if (userExist && userExist.id === data.sub) {
              if (input.newPass === input.confirmPass) {
                const hashedPassword = await hash(input.newPass, 10)

                await ctx.prisma.user.update({
                  where: {
                    id: data.sub
                  },
                  data: {
                    password: {
                      set: hashedPassword
                    }
                  }
                })
                await ctx.prisma.userTokens.delete({
                  where: {
                    token: input.token
                  }
                })
                return {
                  message: 'Password changed',
                  success: true
                }
              } else {
                return {
                  message: 'New password and confirm password are not same',
                  success: false
                }
              }
            } else {
              return {
                message: 'Invalid request',
                success: false
              }
            }



          } else {
            return {
              message: 'Invalid request',
              success: false
            }
          }
        } else {
          return {
            message: 'Invalid request',
            success: false
          }
        }
      } else {
        return {
          message: data,
          success: false
        }
      }










    } catch (error: any) {
      return {
        message: error.message,
        success: false
      };
    }

  }
  @Query(() => UserForResponsce, { nullable: true })
  async me(

    @Ctx() ctx: MyContext
  ): Promise<UserForResponsce | null> {
    try {


      const selectedUserData = {
        firstname: ctx?.user?.firstname,
        lastname: ctx?.user?.lastname,
        email: ctx?.user?.email,
        role: ctx?.user?.role as UserRole,
        status: ctx?.user?.status as UserAccountStatus,
        id: ctx.user?.id,
        phoneNumber:ctx.user?.phoneNumber,
        avater: ctx.user?.avater
      }
      return selectedUserData as UserForResponsce






    } catch (error: any) {
      return null
    }

  }
  @Query(() => UserForResponsce, { nullable: true })
  async meAdmin(

    @Ctx() ctx: MyContext
  ): Promise<UserForResponsce | null> {
    try {

if (
  ctx.user
) {
 if(!(ctx.user.role=== UserRole.admin || ctx.user.role === UserRole.superadmin)){
  return null

 }
  const selectedUserData:UserForResponsce  = {
    firstname: ctx.user.firstname,
    lastname: ctx.user.lastname,
    email: ctx.user.email,
    role: ctx.user.role as UserRole ,
    status: ctx.user.status as UserAccountStatus,
    id: ctx.user.id,
    phoneNumber:ctx.user.phoneNumber??"",
    avater: ctx.user.avater??"",
  }
  return selectedUserData   
}else{
  return null

}
  






    } catch (error: any) {
      return null
    }

  }

  // @Query(() => PaymentMethodDetailsRes, { nullable: true })
  // async paymentMethodDetails(

  //   @Ctx() ctx: MyContext
  // ): Promise<PaymentMethodDetailsRes |null> {
  //   try {

  //     if (ctx.user?.customer_Id) {

  //       const customer = await stripe.customers.retrieve(ctx.user?.customer_Id);

  //       const paymentMethods = await stripe.paymentMethods.list({
  //         customer: ctx.user?.customer_Id,
  //         type: 'card', // Filter for card payment methods
  //       });

  //       return {
  //         brand:paymentMethods.data[0].card?.brand as string,
  //         digit:`**** **** **** ${paymentMethods.data[0].card?.last4}`
  //       }
  //     }else{
  //       return null
  //     }






  //   } catch (error: any) {
  //     return null
  //   }

  // }
}



// export const createCompanyWithOwner =async (_:any, {userInput , companyInput, ownerInput , locationInput , geoLocationInput}:createcompanyWithOwnerInputs ) => {
//   try {
//     return await createUserOwnerWithCompanyService({userInput , companyInput, ownerInput , locationInput , geoLocationInput})
//   } catch (error:any) {
//     return new CustomError(
//       error.message
//    )
//   }
// }

