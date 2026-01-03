package com.ChatMap.Api.Dto;

public record SavedMessageDTO(String type,
                              MessageDTO message) {
    public SavedMessageDTO(MessageDTO message) {
        this("SAVED", message);
    }
}
