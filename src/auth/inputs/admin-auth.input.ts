import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { Range } from 'src/models/enum.model';

@InputType()
export class AdminAuthInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => Range)
  @IsEnum(Range)
  range: Range;
}
