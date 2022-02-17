import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { PasswordService } from 'src/services/password.service';
import { PrismaService } from 'src/services/prisma.service';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [AuthModule],
  providers: [UserResolver, UserService, PrismaService, PasswordService],
})
export class UserModule {}
