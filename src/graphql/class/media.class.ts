import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class fileUploadResponsce {
    @Field()
    message:String
    @Field()

    success: Boolean
    @Field({nullable:true})

    file?:string
}