import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FetchThumbnailOutput {
  @Field({ nullable: true })
  thumbnail_url: string;
}
