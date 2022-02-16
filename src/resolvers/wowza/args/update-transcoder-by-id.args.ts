import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class UpdateTranscoderByIdArgs {
  @Field()
  @IsString()
  transcoderId: string;

  @Field()
  @IsString()
  name: string;
}
