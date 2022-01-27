import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';

@ObjectType()
export class Faq extends BaseModel {
  @Field()
  id: number;

  @Field()
  question: string;

  @Field()
  answer: string;

  @Field()
  writer: string;
}
