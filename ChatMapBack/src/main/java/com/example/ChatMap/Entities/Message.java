package com.example.ChatMap.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="messages")
public class Message {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private String message;
	
	@ManyToOne
	@JsonBackReference
    @JoinColumn(name = "sender", nullable = false)
    private User sender;
	
	
	@ManyToOne
	@JsonBackReference
    @JoinColumn(name = "receiver", nullable = false)
    private User receiver;
	
	public Message() {
		super();
	}

	
	public Message(Integer id, String message, User sender, User receiver) {
		super();
		this.id = id;
		this.message = message;
		this.sender = sender;
		this.receiver = receiver;
	}


	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}


	public User getSender() {
		return sender;
	}


	public void setSender(User sender) {
		this.sender = sender;
	}


	public User getReceiver() {
		return receiver;
	}


	public void setReceiver(User receiver) {
		this.receiver = receiver;
	}

	
	
	
	
	
}
