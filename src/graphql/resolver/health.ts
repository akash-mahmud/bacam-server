

import { Resolver,  Query } from 'type-graphql';



@Resolver()
export class HealthCheckResolver {





  @Query(() => String,)
   healthCheck(

  ): String {
   return 'Everything is fine.😎'

  }
}
