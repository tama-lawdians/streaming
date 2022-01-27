import { Field, ObjectType } from '@nestjs/graphql';
import { Admin } from './admin.model';
import { BaseModel } from './base.model';
import { Range } from './enum.model';

@ObjectType()
export class AdminAuth extends BaseModel {
  @Field()
  id: number;

  @Field({ description: '권한 이름' })
  name: string;

  @Field(() => Range, { description: '권한 범위' })
  range: Range;

  @Field(() => [Admin], { nullable: true })
  admins: Admin[];
}
