import { Resolver, Query } from '@nestjs/graphql';
import { StreamingService } from './streaming.service';

@Resolver()
export class StreamingResolver {
  constructor(private readonly streamingService: StreamingService) {}

  @Query(() => String)
  sayHi() {
    return this.streamingService.sayHi();
  }
}
