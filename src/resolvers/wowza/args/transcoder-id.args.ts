import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class TranscoderIdArgs {
  @Field()
  @IsString()
  transcoderId: string;
}
