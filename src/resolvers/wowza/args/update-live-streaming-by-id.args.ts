import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class UpdateLiveStreamingByIdArgs {
  @Field()
  @IsString()
  streamId: string;

  @Field()
  @IsString()
  name: string;
}
