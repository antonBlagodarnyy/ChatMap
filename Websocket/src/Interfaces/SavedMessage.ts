import type { BaseMessage } from "./Message.js";

export interface SavedMessage extends BaseMessage {
  type: "SAVED";
  message: {
    sender: string;
    senderId: number;
    receiver:string;
    receiverId: number;
    isRead: boolean;
    text: string;
    ts: string;
  };
}
