import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { RedisCacheService } from 'src/cache/redisCache.service';
import { PrismaService } from 'src/services/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { chatRoomListDTO } from './dto/chat.dto';

@Injectable()
export class ChatService {
  private chatRoomList: chatRoomListDTO[];

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisCacheService: RedisCacheService,
  ) {
    this.chatRoomList = [];
  }

  createChatRoom(client: Socket, roomName: string) {
    const roomId = `room:${uuidv4()}`;

    this.chatRoomList.push({
      roomId,
      cheifId: client.id,
      roomName,
      members: [{ nickname: client.data.nickname }],
    });
    client.data.roomId = roomId;
    client.rooms.clear();
    client.join(roomId);
    // client.emit('getMessage', {
    //   id: null,
    //   nickname: '안내',
    //   message: '"' + nickname + '"님이 "' + roomName + '"방을 생성하였습니다.',
    // });
  }

  enterChatRoom(client: Socket, roomId: string) {
    client.data.roomId = roomId;
    client.rooms.clear();
    client.join(roomId);
    const { nickname } = client.data;
    const { roomName } = this.getChatRoom(roomId);
    this.chatRoomList.map((item) => {
      if (item.roomId === roomId) {
        item.members.push({ nickname });
      }
    });
    client.to(roomId).emit('getMessage', {
      id: null,
      nickname: '안내',
      message: `"${nickname}"님이 "${roomName}"방에 접속하셨습니다.`,
    });
  }

  exitChatRoom(client: Socket, roomId: string) {
    client.rooms.clear();
    const { nickname } = client.data;

    this.chatRoomList.map((item) => {
      if (item.roomId === roomId) {
        item.members = item.members.filter(
          (member) => member.nickname !== nickname,
        );
      }
    });

    client.to(roomId).emit('getMessage', {
      id: null,
      nickname: '안내',
      message: '"' + nickname + '"님이 방에서 나갔습니다.',
    });
  }

  getChatRoom(roomId: string): chatRoomListDTO {
    return this.chatRoomList.find((item) => item.roomId === roomId);
  }

  getChatRoomList(): chatRoomListDTO[] {
    console.log('service');
    console.dir(this.chatRoomList, { depth: null });
    return this.chatRoomList;
  }

  deleteChatRoom(roomId: string) {
    this.chatRoomList = this.chatRoomList.filter(
      (item) => item.roomId !== roomId,
    );
  }
}
