import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateLiveStreamOutput {
  @Field()
  sdp_url: string;

  @Field()
  application_name: string;

  @Field()
  stream_name: string;
}
