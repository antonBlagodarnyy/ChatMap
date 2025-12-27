package com.ChatMap.Api.Dto;

import java.util.List;

public record RetrieveMessagesResponse(List<MessageDTO> messages) {
}
