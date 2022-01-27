import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';

@ObjectType()
export class AuthInfo extends BaseModel {
  @Field()
  id: number;

  @Field(() => String)
  email: string;

  @Field()
  isEmailAuth: boolean;

  @Field()
  isPhoneAuth: boolean;

  @Field()
  impUid: string;

  @Field()
  uniqueKey: string;

  @Field()
  isIdCardAuth: boolean;
}
