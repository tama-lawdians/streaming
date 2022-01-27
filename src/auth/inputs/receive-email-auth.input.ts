import { IsString } from 'class-validator';

export class ReceiveEmailAuthInput {
  @IsString()
  readonly token: string;
}
