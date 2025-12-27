import { BaseMessage } from "./Mesage";

export interface ConnectionMessage extends BaseMessage{
  type: 'CONNECTION';
  token: string;
}
