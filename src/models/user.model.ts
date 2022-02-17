import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';

@ObjectType()
export class User extends BaseModel {
  @Field({ description: '회원 id' })
  uid: string;

  password: string;
}
