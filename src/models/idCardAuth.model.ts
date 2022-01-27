import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';
import { DriverLicense } from './driverLicense.model';
import { IDCardAuthKind } from './enum.model';
import { ForeignerRegistration } from './foreignerRegistration.model';
import { NationalIDCard } from './nationalIDCard.model';
import { Passport } from './passport.model';

@ObjectType()
export class IDCardAuth extends BaseModel {
  @Field()
  id: number;

  @Field(() => IDCardAuthKind)
  kind: IDCardAuthKind;

  @Field(() => Passport, { nullable: true })
  passport: Passport;

  @Field(() => DriverLicense, { nullable: true })
  driverLicense: DriverLicense;

  @Field(() => NationalIDCard, { nullable: true })
  nationalIDCard: NationalIDCard;

  @Field(() => ForeignerRegistration, { nullable: true })
  foreignerRegistration: ForeignerRegistration;
}
