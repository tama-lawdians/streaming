import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisCacheService } from 'src/cache/redisCache.service';
import { PasswordService } from 'src/services/password.service';
import { ReceiveEmailAuthInput } from './inputs/receive-email-auth.input';
import { CreateUserAccessTokenOutput } from './outputs/create-user-access-token.output';
import { CreateAccessTokenInput } from './inputs/create-access-token.input';
import { Role } from 'src/models/enum.model';
import { AdminAuthInput } from './inputs/admin-auth.input';
import { PrismaService } from 'src/services/prisma.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly redisCacheService: RedisCacheService,
  ) {}
  // // 로그인 요청 시 email, password 대조
  // async validate(email: string, password: string, role: Role): Promise<any> {
  //   try {
  //     let person;
  //     if (role === Role.ADMIN) {
  //       person = await this.prisma.admin.findFirst({ where: { email, role } });
  //     } else {
  //       person = await this.prisma.user.findFirst({ where: { email, role } });
  //     }
  //     if (!person) {
  //       throw Error(
  //         `존재하지 않는 ${role === Role.ADMIN ? '관리자' : '유저'} 입니다.`,
  //       );
  //     }
  //     // 입력된 비밀번호를 db의 해쉬화된 비밀번호와 대조
  //     const compareResult = await this.passwordService.validatePassword(
  //       password,
  //       person.password,
  //     );
  //     if (!compareResult) {
  //       throw Error('비밀번호가 일치하지 않습니다.');
  //     } else {
  //       if (role === Role.ADMIN) {
  //         const { password, ...result } = person;
  //         return result;
  //       } else {
  //         if (!person.isApproved) {
  //           throw Error('회원가입 승인 대기 중입니다.');
  //         }
  //         const { password, ...result } = person;
  //         return result;
  //       }
  //     }
  //   } catch (e) {
  //     throw Error(e.message ? e.message : `${e}`);
  //   }
  // }
  // // 로그인 성공 시, 유저 access_token 발행
  // async createUserAccessToken({
  //   email,
  //   password,
  // }: CreateAccessTokenInput): Promise<CreateUserAccessTokenOutput> {
  //   try {
  //     const user = await this.validate(email, password, Role.USER);
  //     // 로그인 되어있는지 확인
  //     const checkTTL = await this.redisCacheService.ttl(user.id);
  //     if (checkTTL > 0) {
  //       await this.redisCacheService.del(user.id);
  //     }
  //     // access-token : 2시간
  //     const accessTTL = 60 * 60 * 2;
  //     const accessTokenPayload = {
  //       id: user.id,
  //       email: user.email,
  //       role: user.role,
  //     };
  //     const accessToken = this.jwtService.sign(accessTokenPayload, {
  //       expiresIn: accessTTL,
  //     });
  //     // refresh-token : 4시간
  //     const refreshTTL = 60 * 60 * 4;
  //     const refreshTokenPayload = {
  //       id: user.id,
  //     };
  //     const refreshToken = this.jwtService.sign(refreshTokenPayload, {
  //       expiresIn: refreshTTL,
  //     });
  //     const key = `ACCESS_TOKEN=${user.id}`;
  //     await this.redisCacheService.set(key, accessToken, accessTTL);
  //     return {
  //       accessToken,
  //       refreshToken,
  //     };
  //   } catch (e) {
  //     throw new HttpException(
  //       {
  //         message: `${e}`,
  //         statusCode: HttpStatus.BAD_REQUEST,
  //         error: e.message ? e.message : `${e}`,
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
  // // 로그인 성공 시, 관리자 access_token 발행
  // async createAdminAccessToken({ email, password }: CreateAccessTokenInput) {
  //   try {
  //     const admin = await this.validate(email, password, Role.ADMIN);
  //     // 로그인 되어있는지 확인
  //     const checkTTL = await this.redisCacheService.ttl(admin.id);
  //     if (checkTTL > 0) {
  //       await this.redisCacheService.del(admin.id);
  //     }
  //     // access-token : 2시간
  //     const accessTTL = 60 * 60 * 2;
  //     const accessTokenPayload = {
  //       id: admin.id,
  //       email: admin.email,
  //       role: admin.role,
  //     };
  //     const accessToken = this.jwtService.sign(accessTokenPayload, {
  //       expiresIn: accessTTL,
  //     });
  //     // refresh-token : 4시간
  //     const refreshTTL = 60 * 60 * 4;
  //     const refreshTokenPayload = {
  //       id: admin.id,
  //     };
  //     const refreshToken = this.jwtService.sign(refreshTokenPayload, {
  //       expiresIn: refreshTTL,
  //     });
  //     const key = `ACCESS_TOKEN=${admin.id}`;
  //     await this.redisCacheService.set(key, accessToken, accessTTL);
  //     // 권한 조회
  //     const adminAuth = await this.prisma.admin.findUnique({
  //       where: { email },
  //       select: { adminAuths: true },
  //     });
  //     // 권한 중 name, range만 리턴
  //     const result = adminAuth.adminAuths.map((item) => {
  //       return { name: item.name.toLocaleLowerCase(), range: item.range };
  //     });
  //     return {
  //       accessToken,
  //       refreshToken,
  //       adminAuths: result,
  //     };
  //   } catch (e) {
  //     throw new HttpException(
  //       {
  //         message: `${e}`,
  //         statusCode: HttpStatus.BAD_REQUEST,
  //         error: e.message ? e.message : `${e}`,
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
  // // access token 갱신
  // async renewalAccessToken(clientId: string, refreshToken: string, role: Role) {
  //   try {
  //     const verifiedRefreshToken = await this.jwtService.verify(refreshToken);
  //     const id = verifiedRefreshToken?.id;
  //     if (clientId !== id) {
  //       throw Error('잘못된 토큰 정보입니다');
  //     }
  //     const user = await this.prisma.user.findUnique({
  //       where: { id },
  //     });
  //     if (role !== user.role) {
  //       throw Error('요청하신 역할이 아닙니다.');
  //     }
  //     const payload = { id: user.id, email: user.email, role: user.role };
  //     // access-token : 30분
  //     const accessTTL = 60 * 30;
  //     const accessToken = this.jwtService.sign(payload, {
  //       expiresIn: accessTTL,
  //     });
  //     const key = `ACCESS_TOKEN=${user.id}`;
  //     await this.redisCacheService.set(key, accessToken, accessTTL);
  //     return accessToken;
  //   } catch (e) {
  //     throw new HttpException(
  //       {
  //         message: `${e}`,
  //         statusCode: HttpStatus.BAD_REQUEST,
  //         error: e.message ? e.message : `${e}`,
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
  // agora http basic authentication
  async getAgoraToken() {
    try {
      // HTTP basic authentication example in node.js using the RTC Server RESTful API
      // Customer ID
      const customerKey = '7710ed51e85b4d1bbb7e05d68b960a81';
      // Customer secret
      const customerSecret = '11a13033359b43809d79e0caa8b10fdf';
      // Concatenate customer key and customer secret and use base64 to encode the concatenated string
      const plainCredential = customerKey + ':' + customerSecret;
      // Encode with base64
      const encodedCredential = Buffer.from(plainCredential).toString('base64');
      const authorizationField = 'Basic ' + encodedCredential;

      // Set request parameters
      const { data } = await this.httpService
        .get('http://api.agora.io:443/dev/v1/projects', {
          headers: {
            Authorization: authorizationField,
            'Content-Type': 'application/json',
          },
        })
        .toPromise();

      console.dir(data, { depth: null });
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
  // /* jwt 내용에 대한 결과값 */
  // async jwtValidate(payload): Promise<any> {
  //   try {
  //     let person;
  //     if (payload.role === Role.ADMIN) {
  //       person = await this.prisma.admin.findUnique({
  //         where: { id: payload.id },
  //       });
  //     } else {
  //       person = await this.prisma.user.findUnique({
  //         where: { id: payload.id },
  //       });
  //     }
  //     if (!person) {
  //       throw Error(
  //         `존재하지 않는 ${
  //           payload.role === Role.ADMIN ? '관리자' : '유저'
  //         }입니다.`,
  //       );
  //     }
  //     return person;
  //   } catch (e) {
  //     throw new HttpException(
  //       {
  //         statusCode: HttpStatus.BAD_REQUEST,
  //         error: e.message ? e.message : `${e}`,
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
  // // 이메일 인증 받았을 때
  // async receiveEmailAuth({ token }: ReceiveEmailAuthInput): Promise<boolean> {
  //   try {
  //     const payload = this.jwtService.verify(token);
  //     const email = payload.authKey.replace('REDIS_EMAIL_AUTH_KEY=', '');
  //     // 중복 검사
  //     const checkUser = await this.prisma.user.findUnique({
  //       where: { email },
  //     });
  //     if (checkUser) {
  //       throw Error('이미 해당 이메일의 회원이 존재합니다.');
  //     }
  //     const checkEmailAuth = await this.redisCacheService.get(payload.authKey);
  //     if (checkEmailAuth) {
  //       return true;
  //     }
  //     const authTTL = 60 * 60; // 60분
  //     const authKey = payload.authKey;
  //     const authValue = true;
  //     await this.redisCacheService.set(authKey, authValue, authTTL);
  //     return true;
  //   } catch (e) {
  //     return Promise.reject(e);
  //   }
  // }
  // // 이메일 인증 상태 조회
  // async getIsEmail(email: string) {
  //   try {
  //     const key = `REDIS_EMAIL_AUTH_KEY=${email}`;
  //     const check = await this.redisCacheService.get(key);
  //     if (!check) {
  //       return false;
  //     }
  //     return true;
  //   } catch (e) {
  //     throw Error(e.message ? e.message : `${e}`);
  //   }
  // }
  // // 권한 검사
  // private async checkAdminAuth(adminAuths: AdminAuthInput[]) {
  //   try {
  //     // db 내 권한과 대조
  //     const result = await Promise.all(
  //       adminAuths.map((item) =>
  //         this.prisma.adminAuth.findFirst({
  //           where: { name: item.name, range: item.range },
  //           select: { id: true, name: true },
  //           rejectOnNotFound: () =>
  //             new Error(`권한명 ${item.name}이 존재하지 않습니다.`),
  //         }),
  //       ),
  //     );
  //     // 같은 종류의 권한 제한
  //     for (const item of result) {
  //       const _result = result.filter((el) => el.name === item.name);
  //       if (_result.length > 1) {
  //         throw Error('같은 권한명이 두 개 이상 존재할 수 없습니다.');
  //       }
  //     }
  //     return result;
  //   } catch (e) {
  //     throw new HttpException(
  //       {
  //         statusCode: HttpStatus.BAD_REQUEST,
  //         error: e.message ? e.message : `${e}`,
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
}
