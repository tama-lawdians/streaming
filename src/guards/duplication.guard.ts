import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RedisCacheService } from 'src/cache/redisCache.service';

@Injectable()
export class DuplicationGuard implements CanActivate {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // rest api request
      const request = context.switchToHttp().getRequest();

      // graphql request
      const gqlContext = GqlExecutionContext.create(context).getContext();

      const authorization =
        gqlContext?.req?.headers['authorization'] ||
        request?.headers['authorization'];
      const token = authorization.split(' ')[1];

      // const user: User = gqlContext?.req?.user || request?.user;

      // if (!user) {
      //   return false;
      // }

      // // 헤더에 토큰이 없는 경우
      // if (!token) {
      //   return false;
      // }

      // const key = `ACCESS_TOKEN=${user.id}`;

      // // redis에서 중복검사
      // const getUserToken = await this.redisCacheService.get(key);

      // if (!getUserToken) {
      //   throw Error('Unauthorized');
      // }

      // if (getUserToken !== token) {
      //   throw Error('DUPLICATED_LOGGED_IN');
      // }

      return true;
    } catch (e) {
      throw Error(e.message ? e.message : `${e}`);
    }
  }
}
