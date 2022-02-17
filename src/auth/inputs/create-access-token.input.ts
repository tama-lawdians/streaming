import { ArgsType, Field } from '@nestjs/graphql';
import { IsString, Matches } from 'class-validator';
import { regexPassword } from 'src/utils/regular-expression';

@ArgsType()
export class CreateAccessTokenInput {
  @Field()
  @IsString()
  uid: string;

  @Field()
  @IsString()
  @Matches(regexPassword, {
    message:
      '비밀번호는 영문,숫자,특수문자를 포함하여 8~20자 이내로 입력해주세요.',
  })
  password: string;
}
