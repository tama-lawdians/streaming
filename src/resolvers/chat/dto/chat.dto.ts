export class chatRoomListDTO {
  roomId: string;
  cheifId: string;
  roomName: string;
  members?: memberDTO[];
}

export class setInitDTO {
  nickname: string;
  room?: {
    roomId: string;
    roomName: string;
  };
}

export class memberDTO {
  nickname: string;
}
