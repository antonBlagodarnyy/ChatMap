export interface MessageInfo {
  sender: string;
  senderId: number;
  receiver:string;
  receiverId: number;
  text: string;
  isRead: boolean;
  ts: string;
  isSentByCurrentUser?:boolean;
}
