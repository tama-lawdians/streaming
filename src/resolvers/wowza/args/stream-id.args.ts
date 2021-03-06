import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class StreamIdArgs {
  @Field()
  @IsString()
  streamId: string;
}
