import { BaseMessage } from './Mesage';
import { MessageInfo } from './MessageInfo';

export interface SavedMessage extends BaseMessage {
  type: 'SAVED';
  message: MessageInfo;
  
}
