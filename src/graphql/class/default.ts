import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class defaultResponsce {
    @Field()
    message:String
    @Field()
    success: Boolean
}

@ObjectType()
export class paymentSessionCreateResponse extends defaultResponsce  {
    @Field()
    id:String

}