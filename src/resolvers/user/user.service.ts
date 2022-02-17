import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PasswordService } from 'src/services/password.service';
import { PrismaService } from 'src/services/prisma.service';
import { CreateUserArgs } from './args/create-user.args';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly authService: AuthService,
  ) {}

  // 유저 생성
  async createUser({ uid, password }: CreateUserArgs) {
    try {
      // uid 중복 검사
      await this.authService.checkUid(uid);

      // 비밀번호 해쉬화
      const hashedPassword = await this.passwordService.hashPassword(password);

      // 유저 생성
      await this.prisma.user.create({
        data: { uid, password: hashedPassword },
      });

      return true;
    } catch (e) {
      throw new HttpException(
        {
          message: e.message ? e.message : `${e}`,
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message ? e.message : `${e}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
