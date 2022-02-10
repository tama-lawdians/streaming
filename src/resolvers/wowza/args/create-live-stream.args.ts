import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class CreateLiveStreamArgs {
  @Field()
  @IsString()
  name: string;
}
