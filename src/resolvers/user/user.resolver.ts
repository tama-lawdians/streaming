import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserArgs } from './args/create-user.args';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => Boolean)
  createUser(@Args() data: CreateUserArgs) {
    return this.userService.createUser(data);
  }
}
