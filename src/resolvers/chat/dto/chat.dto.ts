export class chatRoomListDTO {
  roomId: string;
  cheifId: string;
  roomName: string;
}

export class setInitDTO {
  nickname: string;
  room: {
    roomId: string;
    roomName: string;
  };
}
