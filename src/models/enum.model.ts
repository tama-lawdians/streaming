import { registerEnumType } from '@nestjs/graphql';

export enum Range {
  ALL = 'ALL',
  READ = 'READ',
}

registerEnumType(Range, {
  name: 'Range',
  description: '권한 범위',
});

export enum IDCardAuthKind {
  PASSPORT = 'PASSPORT',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
  NATIONAL_ID_CARD = 'NATIONAL_ID_CARD',
  FOREIGNER_REGISTRATION = 'FOREIGNER_REGISTRATION',
}

registerEnumType(IDCardAuthKind, {
  name: 'IDCardAuthKind',
  description: '본인인증용 신분증 종류',
});

export enum FaqCategory {
  total = 'total',
  question = 'question',
  answer = 'answer',
  writer = 'writer',
}

registerEnumType(FaqCategory, {
  name: 'FaqCategory',
  description: 'FAQ 검색 카테고리',
});

export enum NoticeCategory {
  total = 'total',
  title = 'title',
  contents = 'contents',
  writer = 'writer',
}
registerEnumType(NoticeCategory, {
  name: 'NoticeCategory',
  description: '공지사항 검색 카테고리',
});

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(Role, {
  name: 'Role',
  description: '역할',
});
