import { Injectable } from '@nestjs/common';

@Injectable()
export class StreamingService {
  sayHi() {
    try {
      return 'kid hi';
    } catch (e) {
      throw Error(`${e}`);
    }
  }
}
