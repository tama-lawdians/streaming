import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';

@ObjectType()
export class Notice extends BaseModel {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  contents: string;

  @Field()
  writer: string;

  @Field()
  isNew: boolean;

  @Field()
  isFixed: boolean;
}
