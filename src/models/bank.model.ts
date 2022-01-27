import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';

@ObjectType()
export class Bank extends BaseModel {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;
}
