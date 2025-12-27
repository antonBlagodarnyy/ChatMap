package com.ChatMap.Api.Dto;


import com.ChatMap.Api.Entities.Message;

public record ChatPreviewResponse(
		String partnerUsername,
		Integer partnerId,
		MessageDTO message
) {}