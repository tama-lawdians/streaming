import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class GetLiveStreamingByIdArgs {
  @Field()
  @IsString()
  streamId: string;
}
