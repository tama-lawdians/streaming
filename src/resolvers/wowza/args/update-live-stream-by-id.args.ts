import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class UpdateLiveStreamByIdArgs {
  @Field()
  @IsString()
  streamId: string;

  @Field()
  @IsString()
  name: string;
}
