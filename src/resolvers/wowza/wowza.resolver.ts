import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateLiveStreamingArgs } from './args/create-live-streaming.args';
import { GetLiveStreamingByIdArgs } from './args/get-live-streaming-by-id.args';
import { UpdateLiveStreamingByIdArgs } from './args/update-live-streaming-by-id.args';
import { CreateLiveStreamingOutput } from './outputs/create-live-streaming.output';
import { GetAllLiveStreamingOutput } from './outputs/get-all-live-streaming.output';
import { GetLiveStreamingByIdOutput } from './outputs/get-live-streaming-by-id.output';
import { UpdateLiveStreamingByIdOutput } from './outputs/updateLiveStreamingById.output';
import { WowzaService } from './wowza.service';

@Resolver()
export class WowzaResolver {
  constructor(private readonly wowzaService: WowzaService) {}

  @Mutation(() => CreateLiveStreamingOutput)
  createLiveStreaming(@Args() data: CreateLiveStreamingArgs) {
    return this.wowzaService.createLiveStreaming(data);
  }

  @Query(() => GetAllLiveStreamingOutput)
  getAllLiveStreaming() {
    return this.wowzaService.getAllLiveStreaming();
  }

  @Query(() => GetLiveStreamingByIdOutput)
  getLiveStreamingById(@Args() data: GetLiveStreamingByIdArgs) {
    return this.wowzaService.getLiveStreamingById(data);
  }

  @Mutation(() => UpdateLiveStreamingByIdOutput)
  updateLiveStreamingById(@Args() data: UpdateLiveStreamingByIdArgs) {
    return this.wowzaService.updateLiveStreamingById(data);
  }
}
