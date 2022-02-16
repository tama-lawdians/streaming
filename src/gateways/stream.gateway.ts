import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway(8080)
export class StreamGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): string {
    console.log(data);
    return 'Hello world!';
  }
}
