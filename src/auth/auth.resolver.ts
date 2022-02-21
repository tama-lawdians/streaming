import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateAccessTokenInput } from './inputs/create-access-token.input';
import { CreateAdminAccessTokenOutput } from './outputs/create-admin-access-token.output';
import { CreateUserAccessTokenOutput } from './outputs/create-user-access-token.output';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}
  // 유저 엑세스 토큰 생성
  @Query(() => CreateUserAccessTokenOutput, { description: '유저 토큰 생성' })
  async createUserAccessToken(
    @Args() data: CreateAccessTokenInput,
  ): Promise<CreateUserAccessTokenOutput> {
    return this.authService.createUserAccessToken(data);
  }
  // // 관리자 엑세스 토큰 생성
  // @Query(() => CreateAdminAccessTokenOutput)
  // async createAdminAccessToken(
  //   @Args() data: CreateAccessTokenInput,
  // ): Promise<CreateUserAccessTokenOutput> {
  //   return this.authService.createAdminAccessToken(data);
  // }
}
