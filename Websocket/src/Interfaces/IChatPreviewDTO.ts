import type { IResponseMessageDTO } from "./IResponseMessageDTO.js";

export interface IChatPreviewDTO {
  message: IResponseMessageDTO;
  partnerId: number;
}
