import type { BaseMessage } from "./Message.js";

export interface ConnectionMessage extends BaseMessage{
  type: "CONNECTION";
  token: string;
}
