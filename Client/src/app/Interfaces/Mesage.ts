import { SavedMessage } from "./SavedMessage";
import { UnsavedMessage } from "./UnsavedMessage";

export type BaseMessage = {
  type: 'SAVED' | 'UNSAVED' | 'CONNECTION';
};

export type Message = SavedMessage | UnsavedMessage;
