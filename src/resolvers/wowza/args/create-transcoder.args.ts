import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class CreateTranscoderArgs {
  @Field()
  @IsString()
  name: string;
}
