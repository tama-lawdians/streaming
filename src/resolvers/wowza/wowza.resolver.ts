import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateLiveStreamArgs } from './args/create-live-stream.args';
import { CreateTranscoderArgs } from './args/create-transcoder.args';
import { StreamIdArgs } from './args/stream-id.args';
import { TranscoderIdArgs } from './args/transcoder-id.args';
import { UpdateLiveStreamByIdArgs } from './args/update-live-stream-by-id.args';
import { UpdateTranscoderByIdArgs } from './args/update-transcoder-by-id.args';
import { CreateLiveStreamOutput } from './outputs/create-live-stream.output';
import { FetchThumbnailOutput } from './outputs/fetch-thumbnail.output';
import { GetAllLiveStreamOutput } from './outputs/get-all-live-stream.output';
import { GetAllTranscodersOutput } from './outputs/get-all-transcoders.output';
import { GetLiveStreamByIdOutput } from './outputs/get-live-stream-by-id.output';
import { UpdateLiveStreamByIdOutput } from './outputs/update-live-stream-by-id.output';
import { WowzaService } from './wowza.service';

@Resolver()
export class WowzaResolver {
  constructor(private readonly wowzaService: WowzaService) {}

  @Mutation(() => CreateLiveStreamOutput, {
    description: '스트리밍 생성 및 시작',
  })
  createLiveStream(@Args() data: CreateLiveStreamArgs) {
    return this.wowzaService.createLiveStream(data);
  }

  //   @Mutation(() => Boolean)
  //   createTranscoder(@Args() data: CreateTranscoderArgs) {
  //     return this.wowzaService.createTranscoder(data);
  //   }

  @Query(() => GetAllLiveStreamOutput, { description: '스트리밍 목록 조회' })
  getAllLiveStream() {
    return this.wowzaService.getAllLiveStream();
  }

  @Query(() => GetAllTranscodersOutput, { description: '트랜스코더 목록 조회' })
  getAllTranscoders() {
    return this.wowzaService.getAllTranscoders();
  }

  @Query(() => GetLiveStreamByIdOutput, { description: '특정 스트리밍 조회' })
  getLiveStreamById(@Args() data: StreamIdArgs) {
    return this.wowzaService.getLiveStreamById(data);
  }

  @Query(() => Boolean, { description: '특정 transcoder 조회' })
  getTranscoderById(@Args() data: TranscoderIdArgs) {
    return this.wowzaService.getTranscoderById(data);
  }

  @Mutation(() => UpdateLiveStreamByIdOutput, {
    description: '스트리밍 정보 수정',
  })
  updateLiveStreamById(@Args() data: UpdateLiveStreamByIdArgs) {
    return this.wowzaService.updateLiveStreamById(data);
  }

  //   @Mutation(() => Boolean)
  //   updateTranscoderById(@Args() data: UpdateTranscoderByIdArgs) {
  //     return this.wowzaService.updateTranscoderById(data);
  //   }

  // TODO: 방송 정지 + 삭제
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
