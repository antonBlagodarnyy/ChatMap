import type { BaseMessage } from "./Message.js";

export interface SavedMessage extends BaseMessage{
  type: "SAVED";
  sender: string;
  receiver: number;
  text: string;
  ts: string;
}
