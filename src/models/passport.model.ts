import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';
import { IDCardAuth } from './idCardAuth.model';

@ObjectType()
export class Passport extends BaseModel {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  passportNumber: string;

  @Field()
  issueDate: string;

  @Field()
  expirationDate: string;

  @Field()
  birth: string;

  @Field()
  frontImage: string;

  @Field()
  selfieImage: string;

  @Field(() => IDCardAuth, { nullable: true })
  idCardAuth: IDCardAuth;
}
