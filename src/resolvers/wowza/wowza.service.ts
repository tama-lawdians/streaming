import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { CreateLiveStreamingArgs } from './args/create-live-streaming.args';
import { GetLiveStreamingByIdArgs } from './args/get-live-streaming-by-id.args';
import { UpdateLiveStreamingByIdArgs } from './args/update-live-streaming-by-id.args';

@Injectable()
export class WowzaService {
  constructor(private httpService: HttpService) {}

  async createLiveStreaming({ name }: CreateLiveStreamingArgs) {
    try {
      const hostname = 'api.cloud.wowza.com';
      const path = '/api/v1.7/live_streams';

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

  async getAllLiveStreaming() {
    try {
      const hostname = 'api.cloud.wowza.com';
      const path = '/api/v1.7/live_streams';

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

  async getLiveStreamingById({ streamId }: GetLiveStreamingByIdArgs) {
    try {
      const hostname = 'api.cloud.wowza.com';
      const path = `/api/v1.7/live_streams/${streamId}`;

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

      // Set request parameters
      const { data } = await this.httpService
        .get(url, {
          headers,
        })
        .toPromise();

      console.log(data);

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

  async updateLiveStreamingById({
    streamId,
    name,
  }: UpdateLiveStreamingByIdArgs) {
    try {
      const hostname = 'api.cloud.wowza.com';
      const path = `/api/v1.7/live_streams/${streamId}`;

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
}
