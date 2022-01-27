import { SetMetadata } from '@nestjs/common';
import { AdminAuthDecorator } from 'src/models/adminAuth-decorator.model';

export const ADMIN_AUTH_KEY = 'adminAuths';

// @클래스명
export const AdminAuths = (...adminAuths: AdminAuthDecorator[]) =>
  SetMetadata(ADMIN_AUTH_KEY, adminAuths);
