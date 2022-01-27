import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export abstract class BaseModel {
  @Field(() => ID)
  id: string | number;

  @Field({ description: '생성일' })
  createdAt: Date;

  @Field({ description: '수정일' })
  updatedAt: Date;
}
