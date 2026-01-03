import { MessageInfo } from './MessageInfo';


export interface ChatPreview {
  message: MessageInfo;
  partnerId: number;
  partnerUsername: string;
  unreadCount: number;
}
