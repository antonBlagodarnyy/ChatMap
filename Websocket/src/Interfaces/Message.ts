import type { ConnectionMessage } from "./ConnectionMessage.js";
import type { SavedMessage } from "./SavedMessage.js";
import type { UnsavedMessage } from "./UnsavedMessage.js";

export type BaseMessage = {
  type: "SAVED" | "UNSAVED" | "CONNECTION";
};

export type Message = SavedMessage | UnsavedMessage | ConnectionMessage;
