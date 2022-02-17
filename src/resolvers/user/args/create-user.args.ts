import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class CreateUserArgs {
  @Field({ description: '유저 ID' })
  @IsString()
  uid: string;

  @Field({ description: '비밀번호' })
  @IsString()
  password: string;
}
