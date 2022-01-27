import { Field, ObjectType } from '@nestjs/graphql';
import { Range } from './enum.model';

@ObjectType()
export class AdminAuthDecorator {
  @Field({ description: '권한 이름' })
  name: string;

  @Field(() => Range, { description: '권한 범위' })
  range: Range;
}
