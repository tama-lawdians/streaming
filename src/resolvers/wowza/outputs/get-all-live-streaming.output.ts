import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetAllLiveStreamingOutput {
  @Field(() => [LiveStreams])
  liveStreams: LiveStreams[];

  @Field()
  totalCount: number;
}

@ObjectType()
class LiveStreams {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;
}
