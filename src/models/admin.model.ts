import { Field, ObjectType } from '@nestjs/graphql';
import { AdminAuth } from './adminAuth.model';
import { BaseModel } from './base.model';

@ObjectType()
export class Admin extends BaseModel {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field({ nullable: true })
  otpSecret: string;

  @Field(() => [AdminAuth], { nullable: true })
  adminAuths: AdminAuth[];
}
