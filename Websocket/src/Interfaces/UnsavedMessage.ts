import type { BaseMessage } from "./Message.js";

export interface UnsavedMessage  extends BaseMessage{
  type: 'UNSAVED';
  receiver: number;
  text: string;
}
