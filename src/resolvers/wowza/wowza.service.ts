import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { RedisCacheService } from 'src/cache/redisCache.service';
import { CreateLiveStreamArgs } from './args/create-live-stream.args';
import { CreateTranscoderArgs } from './args/create-transcoder.args';
import { StreamIdArgs } from './args/stream-id.args';
import { TranscoderIdArgs } from './args/transcoder-id.args';
import { UpdateLiveStreamByIdArgs } from './args/update-live-stream-by-id.args';
import { UpdateTranscoderByIdArgs } from './args/update-transcoder-by-id.args';

@Injectable()
export class WowzaService {
  constructor(
    private httpService: HttpService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  private setLiveStream(category?: string, streamId?: string, data?: string) {
    const hostname = 'api.cloud.wowza.com';
    let path = '/api/v1.7/live_streams';

    if (category) {
      switch (category) {
        case 'getLiveStreamById':
          path = path + '/' + streamId;
          break;
        case 'updateLiveStreamById':
          path = path + '/' + streamId;
          break;
        case 'startLiveStream':
          path = path + '/' + streamId + '/' + data;
          break;
        case 'stopLiveStream':
          path = path + '/' + streamId + '/' + data;
          break;
        case 'fetchThumbnail':
          path = path + '/' + streamId + '/' + data;
          break;
        case 'fetchState':
          path = path + '/' + streamId + '/' + data;
          break;
        case 'fetchMetrics':
          path = path + '/' + streamId + '/' + data;
          break;
        default:
          break;
      }
    }

    const wscApiKey = process.env.WOWZA_API_KEY;
    const wscAccessKey = process.env.WOWZA_ACCESS_KEY;
    const timestamp = Math.round(new Date().getTime() / 1000);
    const hmacData = timestamp + ':' + path + ':' + wscApiKey;

    const signature = crypto
      .createHmac('sha256', wscApiKey)
      .update(hmacData)
      .digest('hex');

    const headers = {
      'wsc-access-key': wscAccessKey,
      'wsc-timestamp': timestamp,
      'wsc-signature': signature,
      'Content-Type': 'application/json',
    };

    const url = 'https://' + hostname + path;

    return { url, headers };
  }

  private setTranscoder(
    category?: string,
    transcoderId?: string,
    data?: string,
  ) {
    const hostname = 'api.cloud.wowza.com';
    let path = '/api/v1.7/transcoders';

    if (category) {
      switch (category) {
        case 'getTranscoderById':
          path = path + '/' + transcoderId;
          break;
        case 'updateTranscoderById':
          path = path + '/' + transcoderId;
          break;
        default:
          break;
      }
    }

    const wscApiKey = process.env.WOWZA_API_KEY;
    const wscAccessKey = process.env.WOWZA_ACCESS_KEY;
    const timestamp = Math.round(new Date().getTime() / 1000);
    const hmacData = timestamp + ':' + path + ':' + wscApiKey;

    const signature = crypto
      .createHmac('sha256', wscApiKey)
      .update(hmacData)
      .digest('hex');

    const headers = {
      'wsc-access-key': wscAccessKey,
      'wsc-timestamp': timestamp,
      'wsc-signature': signature,
      'Content-Type': 'application/json',
    };

    const url = 'https://' + hostname + path;

    return { url, headers };
  }

  async createLiveStream({ name }: CreateLiveStreamArgs) {
    try {
      const { url, headers } = this.setLiveStream();

      // Set request parameters
      const { data } = await this.httpService
        .post(
          url,
          {
            live_stream: {
              aspect_ratio_height: 720,
              aspect_ratio_width: 1280,
              billing_mode: 'pay_as_you_go',
              broadcast_location: 'asia_pacific_s_korea',
              encoder: 'other_webrtc',
              name,
              transcoder_type: 'transcoded',
              low_latency: true,
            },
          },
          {
            headers,
          },
        )
        .toPromise();

      await this.startLiveStream({ streamId: data.live_stream.id });

      while (true) {
        const res = await this.fetchState({ streamId: data.live_stream.id });

        if (res === 'started') {
          break;
        }
      }

      const chatKey = `CHATTING_ROOM=${data.live_stream.id}`;

      const chatValue = { users: [], chat: [], totalCount: 1 };

      // 1??????
      const chatTTL = 60 * 60;

      await this.redisCacheService.set(chatKey, chatValue, chatTTL);

      return {
        sdp_url: data.live_stream.source_connection_information.sdp_url,
        application_name:
          data.live_stream.source_connection_information.application_name,
        stream_name: data.live_stream.source_connection_information.stream_name,
      };
    } catch (e) {
      throw new HttpException(
        {
          message: e.message ? e.message : `${e}`,
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message ? e.message : `${e}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createTranscoder({ name }: CreateTranscoderArgs) {
    try {
      const { url, headers } = this.setTranscoder();

      console.log(url);

      // Set request parameters
      const { data } = await this.httpService
        .post(
          url,
          {
            transcoder: {
              billing_mode: 'pay_as_you_go',
              broadcast_location: 'asia_pacific_s_korea',
              delivery_method: 'push',
              name,
              protocol: 'webrtc',
              transcoder_type: 'transcoded',
              property: 'my value',
            },
          },
          {
            headers,
          },
        )
        .toPromise();

      console.log(data);

      return true;
      //   return {
      //     id: data.live_stream.id,
      //     name: data.live_stream.name,
      //     player_hls_playback_url: data.live_stream.player_hls_playback_url,
      //     created_at: data.live_stream.created_at,
      //     updated_at: data.live_stream.updated_at,
      //   };
    } catch (e) {
      console.log(e.response.data);
      throw new HttpException(
        {
          message: e.message ? e.message : `${e}`,
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message ? e.message : `${e}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllLiveStream() {
    try {
      const { url, headers } = this.setLiveStream();

      // Set request parameters
      const { data } = await this.httpService
        .get(url, {
          headers,
        })
        .toPromise();

      const liveStreams = data.live_streams;

      const totalCount = data.pagination.total_records;

      return { liveStreams, totalCount };
    } catch (e) {
      throw new HttpException(
        {
          message: e.message ? e.message : `${e}`,
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message ? e.message : `${e}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllTranscoders() {
    try {
      const { url, headers } = this.setTranscoder();

      // Set request parameters
      const { data } = await this.httpService
        .get(url, {
          headers,
        })
        .toPromise();

      const transcoders = data.transcoders;

      const totalCount = transcoders.length;

      return { transcoders, totalCount };
    } catch (e) {
      throw new HttpException(
        {
          message: e.message ? e.message : `${e}`,
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message ? e.message : `${e}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getLiveStreamById({ streamId }: StreamIdArgs) {
    try {
      const { url, headers } = this.setLiveStream(
        'getLiveStreamById',
        streamId,
      );

      // Set request parameters
      const { data } = await this.httpService
        .get(url, {
          headers,
        })
        .toPromise();

      console.dir(data, { depth: null });

      return {
        name: data.live_stream.name,
        player_hls_playback_url: data.live_stream.player_hls_playback_url,
        created_at: data.live_stream.created_at,
        updated_at: data.live_stream.updated_at,
      };
    } catch (e) {
      throw new HttpException(
        {
          message: e.message ? e.message : `${e}`,
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message ? e.message : `${e}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getTranscoderById({ transcoderId }: TranscoderIdArgs) {
    try {
      const { url, headers } = this.setTranscoder(
        'getTranscoderById',
        transcoderId,
      );

      // Set request parameters
      const { data } = await this.httpService
        .get(url, {
          headers,
        })
        .toPromise();

      console.dir(data, { depth: null });

      return true;
      // return {
      //   name: data.live_stream.name,
      //   player_hls_playback_url: data.live_stream.player_hls_playback_url,
      //   created_at: data.live_stream.created_at,
      //   updated_at: data.live_stream.updated_at,
      // };
    } catch (e) {
      throw new HttpException(
        {
          message: e.message ? e.message : `${e}`,
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message ? e.message : `${e}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateLiveStreamById({ streamId, name }: UpdateLiveStreamByIdArgs) {
    try {
      const { url, headers } = this.setLiveStream(
        'updateLiveStreamById',
        streamId,
      );

      // Set request parameters
      const { data } = await this.httpService
        .patch(
          url,
          {
            live_stream: {
              name,
            },
          },
          {
            headers,
          },
        )
        .toPromise();

      return {
        name: data.live_stream.name,
        player_hls_playback_url: data.live_stream.player_hls_playback_url,
        created_at: data.live_stream.created_at,
        updated_at: data.live_stream.updated_at,
      };
    } catch (e) {
      throw new HttpException(
        {
          message: e.message ? e.message : `${e}`,
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message ? e.message : `${e}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateTranscoderById({ transcoderId, name }: UpdateTranscoderByIdArgs) {
    try {
      const { url, headers } = this.setTranscoder(
        'updateTranscoderById',
        transcoderId,
      );

      // Set request parameters
      const { data } = await this.httpService
        .patch(
          url,
          {
            transcoder: {
              name,
              low_latency: true,
            },
          },
          {
            headers,
          },
        )
        .toPromise();

      console.log(data);

      return true;
    } catch (e) {
      console.log(e.response.data);
      throw new HttpException(
        {
          message: e.message ? e.message : `${e}`,
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message ? e.message : `${e}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async startLiveStream({ streamId }: StreamIdArgs) {
    try {
      const { url, headers } = this.setLiveStream(
        'startLiveStream',
        streamId,
        'start',
      );

      console.log(url);

      // Set request parameters
      const { data } = await this.httpService
        .put(
          url,
          {},
          {
            headers,
          },
        )
        .toPromise();

      console.log(data);

      return true;
    } catch (e) {
      //   console.dir(e, { depth: null });
      console.log(e.response.data);
      throw new HttpException(
        {
          message: e.message ? e.message : `${e}`,
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message ? e.message : `${e}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async stopLiveStream({ streamId }: StreamIdArgs) {
    try {
      const { url, headers } = this.setLiveStream(
        'stopLiveStream',
        streamId,
        'stop',
      );

      // Set request parameters
      const { data } = await this.httpService
        .put(
          url,
          {},
          {
            headers,
          },
        )
        .toPromise();

      console.log(data);

      return true;
    } catch (e) {
      throw new HttpException(
        {
          message: e.message ? e.message : `${e}`,
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message ? e.message : `${e}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async fetchThumbnail({ streamId }: StreamIdArgs) {
    try {
      const { url, headers } = this.setLiveStream(
        'fetchThumbnail',
        streamId,
        'thumbnail_url',
      );

      // Set request parameters
      const { data } = await this.httpService
        .get(url, {
          headers,
        })
        .toPromise();

      console.log(data);

      return { thumbnail_url: data.live_stream.thumbnail_url };
    } catch (e) {
      throw new HttpException(
        {
          message: e.message ? e.message : `${e}`,
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message ? e.message : `${e}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async fetchState({ streamId }: StreamIdArgs) {
    try {
      const { url, headers } = this.setLiveStream(
        'fetchState',
        streamId,
        'state',
      );

      // Set request parameters
      const { data } = await this.httpService
        .get(url, {
          headers,
        })
        .toPromise();

      console.log(data);

      return data.live_stream.state;
    } catch (e) {
      throw new HttpException(
        {
          message: e.message ? e.message : `${e}`,
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message ? e.message : `${e}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async fetchMetrics({ streamId }: StreamIdArgs) {
    try {
      const { url, headers } = this.setLiveStream(
        'fetchMetrics',
        streamId,
        'stats',
      );

      // Set request parameters
      const { data } = await this.httpService
        .get(url, {
          headers,
        })
        .toPromise();

      console.log(data);

      return true;
    } catch (e) {
      throw new HttpException(
        {
          message: e.message ? e.message : `${e}`,
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message ? e.message : `${e}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
