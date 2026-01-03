package com.ChatMap.Api.Dto;


public record ChatPreviewResponse(
        MessageDTO message,
        Integer partnerId,
        String partnerUsername,
        Long unreadCount

) {
}