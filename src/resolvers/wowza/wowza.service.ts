import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { CreateLiveStreamArgs } from './args/create-live-stream.args';
import { StreamIdArgs } from './args/stream-id.args';
import { UpdateLiveStreamByIdArgs } from './args/update-live-stream-by-id.args';

@Injectable()
export class WowzaService {
  constructor(private httpService: HttpService) {}

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
    console.log(path);

    const wscApiKey = process.env.WOWZA_API_KEY;
    console.log(wscApiKey);
    const wscAccessKey = process.env.WOWZA_ACCESS_KEY;
    console.log(wscAccessKey);
    const timestamp = Math.round(new Date().getTime() / 1000);
    const hmacData = timestamp + ':' + path + ':' + wscApiKey;
    console.log(hmacData);

    const signature = crypto
      .createHmac('sha256', wscApiKey)
      .update(hmacData)
      .digest('hex');

    console.log(signature);
    const headers = {
      'wsc-access-key': wscAccessKey,
      'wsc-timestamp': timestamp,
      'wsc-signature': signature,
      'Content-Type': 'application/json',
    };

    console.log(headers);

    const url = 'https://' + hostname + path;

    return { url, headers };
  }

  private setPlayers(category?: string, streamId?: string, data?: string) {
    const hostname = 'api.cloud.wowza.com';
    let path = '/api/v1.7/players';

    if (category) {
      switch (category) {
        case 'getAllPlayerUrls':
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
            },
          },
          {
            headers,
          },
        )
        .toPromise();

      return {
        id: data.live_stream.id,
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

      console.log(data);

      console.log(data.live_stream.stream_target);

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
