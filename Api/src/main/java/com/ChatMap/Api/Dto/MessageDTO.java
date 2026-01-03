package com.ChatMap.Api.Dto;

import java.util.Date;

public record MessageDTO(String sender,
                         Integer senderId,
                         String receiver,
                         Integer receiverId,
                         String text,
                         Date ts,
                         Boolean isRead) {
}
