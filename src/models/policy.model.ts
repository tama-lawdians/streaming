import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';

@ObjectType()
export class Policy extends BaseModel {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  contents: string;
}
