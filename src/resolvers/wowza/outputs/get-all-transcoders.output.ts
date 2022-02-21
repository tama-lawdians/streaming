import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetAllTranscodersOutput {
  @Field(() => [Transcoders])
  transcoders: Transcoders[];

  @Field()
  totalCount: number;
}

@ObjectType()
class Transcoders {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  workflow: string;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;
}
