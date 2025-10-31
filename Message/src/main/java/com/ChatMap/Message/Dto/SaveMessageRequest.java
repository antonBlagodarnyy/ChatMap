package com.ChatMap.Message.Dto;

public class SaveMessageRequest {


	private Integer receiver;
	private String text;

	public SaveMessageRequest(Integer receiver, String text) {
		super();

		this.receiver = receiver;
		this.text = text;
	}


	public Integer getReceiver() {
		return receiver;
	}

	public void setReceiver(Integer receiver) {
		this.receiver = receiver;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

}
