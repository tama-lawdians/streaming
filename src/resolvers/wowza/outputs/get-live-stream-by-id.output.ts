import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetLiveStreamByIdOutput {
  @Field()
  name: string;

  @Field()
  player_hls_playback_url: string;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;
}
