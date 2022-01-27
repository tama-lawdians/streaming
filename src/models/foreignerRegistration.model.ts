import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';
import { IDCardAuth } from './idCardAuth.model';

@ObjectType()
export class ForeignerRegistration extends BaseModel {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  issueNo: string;

  @Field({ nullable: true })
  issueDate: string;

  @Field()
  frontImage: string;

  @Field()
  selfieImage: string;

  @Field(() => IDCardAuth, { nullable: true })
  idCardAuth: IDCardAuth;
}
