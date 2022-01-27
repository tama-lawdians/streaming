import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';
import { IDCardAuth } from './idCardAuth.model';

@ObjectType()
export class NationalIDCard extends BaseModel {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  registrationNumber: string;

  @Field()
  issueDate: string;

  @Field()
  frontImage: string;

  @Field()
  bakcImage: string;

  @Field()
  selfieImage: string;

  @Field(() => IDCardAuth, { nullable: true })
  idCardAuth: IDCardAuth;
}
