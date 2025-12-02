package com.ChatMap.Message.Dto;

import com.ChatMap.Message.Entities.Message;

public class ChatPreviewResDTO {
	private Integer partnerId;
	private Message message;
	
	public ChatPreviewResDTO(Integer partnerId, Message message) {
		super();
		this.partnerId = partnerId;
		this.message = message;
	}
	
	public Integer getPartnerId() {
		return partnerId;
	}
	public void setPartnerId(Integer partnerId) {
		this.partnerId = partnerId;
	}
	public Message getMessage() {
		return message;
	}
	public void setMessage(Message message) {
		this.message = message;
	}
	
}
