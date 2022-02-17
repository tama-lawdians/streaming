import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway(8080) // socket server 세팅 (Port)
export class StreamGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('kid') // 'message' 라는 이름의 event 를 받으면 handleMessage 함수 실행
  handleMessage(@MessageBody() data: string): string {
    // console.log(client);
    // console.log(payload);
    console.log(data);
    return 'Hello world!';
  }
}
