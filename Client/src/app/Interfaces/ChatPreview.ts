import { SavedMessage } from "./SavedMessage";

export interface ChatPreview {
  message: SavedMessage;
  partnerUsername: string;
  partnerId: number
}
