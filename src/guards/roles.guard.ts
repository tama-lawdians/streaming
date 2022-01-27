import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from 'src/models/enum.model';
import { Admin } from 'src/models/admin.model';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // @Roles() 로 오는 인자
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    // rest api request
    const request = context.switchToHttp().getRequest();

    // graphql request
    const gqlContext = GqlExecutionContext.create(context).getContext();

    // const user: User | Admin = gqlContext?.req?.user || request?.user;

    // if (!user) {
    //   throw Error('존재하지 않는 유저입니다.');
    // }

    // if (requiredRoles.some((role) => user.role?.includes(role))) {
    //   return true;
    // } else {
    //   throw Error('접근 권한이 없습니다.');
    // }
  }
}
