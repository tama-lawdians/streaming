import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class PasswordService {
  // hash화 한 비밀번호를 대조
  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  // 비밀번호를 hash화
  hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }
}
