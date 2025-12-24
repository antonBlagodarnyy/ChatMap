package com.ChatMap.Api.Dto;


import com.ChatMap.Api.Entities.Message;

public record ChatPreviewResDTO(
		String partnerUsername,
		Integer partnerId,
		Message message
) {}