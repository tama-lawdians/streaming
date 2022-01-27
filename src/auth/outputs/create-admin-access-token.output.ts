import { Field, ObjectType } from '@nestjs/graphql';
import { AdminAuthDecorator } from 'src/models/adminAuth-decorator.model';

@ObjectType()
export class CreateAdminAccessTokenOutput {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => [AdminAuthDecorator])
  adminAuths: AdminAuthDecorator[];
}
