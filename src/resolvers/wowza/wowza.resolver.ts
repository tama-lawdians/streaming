import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateLiveStreamArgs } from './args/create-live-stream.args';
import { StreamIdArgs } from './args/stream-id.args';
import { UpdateLiveStreamByIdArgs } from './args/update-live-stream-by-id.args';
import { CreateLiveStreamOutput } from './outputs/create-live-stream.output';
import { FetchThumbnailOutput } from './outputs/fetch-thumbnail.output';
import { GetAllLiveStreamOutput } from './outputs/get-all-live-stream.output';
import { GetLiveStreamByIdOutput } from './outputs/get-live-stream-by-id.output';
import { UpdateLiveStreamByIdOutput } from './outputs/update-live-stream-by-id.output';
import { WowzaService } from './wowza.service';

@Resolver()
export class WowzaResolver {
  constructor(private readonly wowzaService: WowzaService) {}

  @Mutation(() => CreateLiveStreamOutput)
  createLiveStream(@Args() data: CreateLiveStreamArgs) {
    return this.wowzaService.createLiveStream(data);
  }

  @Query(() => GetAllLiveStreamOutput)
  getAllLiveStream() {
    return this.wowzaService.getAllLiveStream();
  }

  @Query(() => GetLiveStreamByIdOutput)
  getLiveStreamById(@Args() data: StreamIdArgs) {
    return this.wowzaService.getLiveStreamById(data);
  }

  @Mutation(() => UpdateLiveStreamByIdOutput)
  updateLiveStreamById(@Args() data: UpdateLiveStreamByIdArgs) {
    return this.wowzaService.updateLiveStreamById(data);
  }

  @Mutation(() => Boolean)
  startLiveStream(@Args() data: StreamIdArgs) {
    return this.wowzaService.startLiveStream(data);
  }

  @Mutation(() => Boolean)
  stopLiveStream(@Args() data: StreamIdArgs) {
    return this.wowzaService.stopLiveStream(data);
  }

  @Query(() => FetchThumbnailOutput)
  fetchThumbnail(@Args() data: StreamIdArgs) {
    return this.wowzaService.fetchThumbnail(data);
  }

  @Query(() => String)
  fetchState(@Args() data: StreamIdArgs) {
    return this.wowzaService.fetchState(data);
  }

  @Query(() => Boolean)
  fetchMetrics(@Args() data: StreamIdArgs) {
    return this.wowzaService.fetchMetrics(data);
  }
}
