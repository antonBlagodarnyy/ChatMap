import { BaseMessage } from "./Mesage";

export interface UnsavedMessage extends BaseMessage{
    type:'UNSAVED';
  receiver:number;
  text: string;
}
