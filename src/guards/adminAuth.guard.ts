import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { AdminAuth } from 'src/models/adminAuth.model';
import { ADMIN_AUTH_KEY } from 'src/decorators/admin-auth.decorator';
import { Admin } from 'src/models/admin.model';
import { PrismaService } from 'nestjs-prisma';
import { Range } from 'src/models/enum.model';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // @AdminAuths() 로 오는 인자
    const requiredAdminAuths = this.reflector.getAllAndOverride<AdminAuth[]>(
      ADMIN_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredAdminAuths) {
      return true;
    }

    // rest api request
    const request = context.switchToHttp().getRequest();

    // graphql request
    const gqlContext = GqlExecutionContext.create(context).getContext();

    // 요청 관리자
    const admin: Admin = gqlContext?.req?.user || request?.user;

    if (!admin) {
      throw Error('존재하지 않는 관리자 입니다.');
    }

    // // 관리자 재정의 // adminAuth 조회를 위해
    // const foundAdmin = await this.prisma.admin.findUnique({
    //   where: { id: admin.id },
    //   select: { adminAuths: true },
    // });

    // // 마스터 권한 확인
    // const masterCheck = foundAdmin.adminAuths.find(
    //   (item) => item.name === 'MASTER',
    // );

    // // 마스터 선 처리
    // if (masterCheck) {
    //   return true;
    // // }

    // for (const item of requiredAdminAuths) {
    //   let result;

    //   // read 는 read, all 둘 다 가능
    //   // all 은 all 만 가능
    //   if (item.range === Range.READ) {
    //     result = foundAdmin.adminAuths.find((el) => el.name === item.name);
    //   } else {
    //     result = foundAdmin.adminAuths.find(
    //       (el) => el.name === item.name && el.range === item.range,
    //     );
    //   }

    //   if (!result) {
    //     throw Error('접근 권한이 없습니다.');
    //   }
    // }

    return true;
  }
}
