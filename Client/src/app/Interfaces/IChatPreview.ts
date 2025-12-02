import { IMessage } from "./IMessage";

export interface IChatPreview {
  message: IMessage;
  partnerName: string;
  partnerId: number
}
