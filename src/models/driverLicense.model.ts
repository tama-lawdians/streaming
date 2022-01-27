import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';
import { IDCardAuth } from './idCardAuth.model';

@ObjectType()
export class DriverLicense extends BaseModel {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  birth: string;

  @Field()
  areaCode: string;

  @Field()
  driverLicenseNumber: string;

  @Field()
  cryptoNumber: string;

  @Field()
  frontImage: string;

  @Field()
  backImage: string;

  @Field()
  selfieImage: string;

  @Field(() => IDCardAuth, { nullable: true })
  idCardAuth: IDCardAuth;
}
