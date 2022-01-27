import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RedisCacheModule } from 'src/cache/redisCache.module';
import { PasswordService } from 'src/services/password.service';
import { PrismaService } from 'src/services/prisma.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    RedisCacheModule,
    HttpModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    PasswordService,
    PrismaService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
