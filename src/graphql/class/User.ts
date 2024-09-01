import { Args, ArgsType, Field, InputType, ObjectType, } from "type-graphql";
import {
    User,



    UserRole, UserAccountStatus



} from "@generated/type-graphql";
@ObjectType()
export class UserForResponsce {
    @Field({ nullable: true })
    firstname: string;
    @Field({ nullable: true })
    phoneNumber?: string ;
    
    @Field({ nullable: true })
    id: string;
    @Field({ nullable: true })
    lastname: string;
    @Field({ nullable: true })
    email: string;
    @Field({ nullable: true })
    role: UserRole
    @Field()
    status: UserAccountStatus
    @Field({nullable:true})

    avater?: string 

}


@ObjectType()
export class LoginResponsce {
    @Field({ nullable: true })
    accessToken?: String
    @Field({ nullable: true })
    user?: UserForResponsce
    @Field()
    success?: Boolean
    @Field()
    isAuthenticated?: Boolean

    @Field()
    message: String
}
@InputType({ description: "New user data" })
export class CreateOneUserArgsCustom implements Partial<User>{
    @Field()
    firstname: string;
    @Field()
    lastname: string;
    @Field({ nullable: true })
    avater?: string;
    @Field({ nullable: true })

    phoneNumber?: string;

    @Field()
    email: string;
    @Field()

    password: string;

}

@InputType({ description: "New user data" })
export class UpdateOneUserArgsCustom implements Partial<User>{
       @Field({ nullable: true })

    firstname: string;
       @Field({ nullable: true })

    lastname: string;
    @Field({ nullable: true })
    avater?: string;
    @Field({ nullable: true })

    phoneNumber?: string;

       @Field({ nullable: true })

    email: string;


}

@InputType({ description: "New user data" })
export class UpdateProfilePaswordArgs {
    @Field({nullable:true})
    oldPassword: string;
    @Field({ nullable:true })
    newPassword: string;

    @Field({  })
    updatePassword: boolean;



}

@InputType()
export class ReesetPassByLinkInput {
    @Field()
    newPass: string;
    @Field()
    confirmPass: string;
    @Field()
    token: string;
}

@ObjectType()
export class PaymentMethodDetailsRes {
    @Field()
    brand: string;
    @Field()
    digit: string;

}


export interface IJwtPayload {
    user: {
      id: string;
  
      email: string;
    };
  }