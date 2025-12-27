export interface SavedMessage {
  type: "SAVED";
  sender: string;
  receiver: number;
  text: string;
  ts: string;
}
