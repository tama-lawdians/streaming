import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class CreateLiveStreamingArgs {
  @Field()
  @IsString()
  name: string;
}
