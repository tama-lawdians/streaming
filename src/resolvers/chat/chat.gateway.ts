import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/resolvers/chat/chat.service';
import { setInitDTO } from 'src/resolvers/chat/dto/chat.dto';

@WebSocketGateway(8080, { cors: true }) // socket server 세팅 (Port)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  client: Record<string, any>;
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer()
  server: Server;

  public handleConnection(client) {
    console.log('connected', client.id);
    client.leave(client.id);
    client.data.roomId = `room:lobby`;
    client.join('room:lobby');
  }

  public handleDisconnect(client): void {
    const { roomId } = client.data;
    if (
      roomId != 'room:lobby' &&
      !this.server.sockets.adapter.rooms.get(roomId)
    ) {
      this.chatService.deleteChatRoom(roomId);
      this.server.emit('getChatRoomList', this.chatService.getChatRoomList());
    }
    console.log('disonnected', client.id);
  }

  //채팅방 들어가기
  @SubscribeMessage('enterChatRoom')
  enterChatRoom(client: Socket, roomId: string) {
    //이미 접속해있는 방 일 경우 재접속 차단
    if (client.rooms.has(roomId)) {
      return;
    }
    //이전 방이 만약 나 혼자있던 방이면 제거
    if (
      client.data.roomId != 'room:lobby' &&
      this.server.sockets.adapter.rooms.get(client.data.roomId).size == 1
    ) {
      this.chatService.deleteChatRoom(client.data.roomId);
    }
    this.chatService.enterChatRoom(client, roomId);
    return {
      roomId: roomId,
      roomName: this.chatService.getChatRoom(roomId).roomName,
    };
  }

  @SubscribeMessage('message') // 'message' 라는 이름의 event 를 받으면 handleMessage 함수 실행
  handleMessage(
    @MessageBody() data: string,
    // @ConnectedSocket() client: Socket,
  ): void {
    console.log(data);
    this.server.emit('getMessage', data);
  }

  //메시지가 전송되면 모든 유저에게 메시지 전송
  @SubscribeMessage('sendMessage')
  sendMessage(client: Socket, message: string): void {
    const { roomId } = client.data;
    client.to(roomId).emit('getMessage', {
      id: client.id,
      nickname: client.data.nickname,
      message,
    });
  }

  //처음 접속시 닉네임 등 최초 설정
  @SubscribeMessage('setInit')
  setInit(client: Socket, data: setInitDTO): setInitDTO {
    // 이미 최초 세팅이 되어있는 경우 패스
    if (client.data.isInit) {
      return;
    }

    client.data.nickname = data.nickname
      ? data.nickname
      : '낯선사람' + client.id;

    client.data.isInit = true;

    return {
      nickname: client.data.nickname,
      room: {
        roomId: 'room:lobby',
        roomName: '로비',
      },
    };
  }

  //채팅방 목록 가져오기
  @SubscribeMessage('getChatRoomList')
  getChatRoomList(client: Socket, payload: any) {
    client.emit('getChatRoomList', this.chatService.getChatRoomList());
  }

  //채팅방 생성하기
  @SubscribeMessage('createChatRoom')
  createChatRoom(client: Socket, roomName: string) {
    //이전 방이 만약 나 혼자있던 방이면 제거
    if (
      client.data.roomId != 'room:lobby' &&
      this.server.sockets.adapter.rooms.get(client.data.roomId).size == 1
    ) {
      this.chatService.deleteChatRoom(client.data.roomId);
    }

    this.chatService.createChatRoom(client, roomName);
    return {
      roomId: client.data.roomId,
      roomName: this.chatService.getChatRoom(client.data.roomId).roomName,
    };
  }
}
