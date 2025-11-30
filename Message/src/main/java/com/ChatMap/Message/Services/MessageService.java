package com.ChatMap.Message.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ChatMap.Message.Dto.SaveMessageRequest;
import com.ChatMap.Message.Entities.Message;
import com.ChatMap.Message.Repositories.MessageRepository;

@Service
public class MessageService {

	@Autowired
	private MessageRepository messageRepository;

	public void saveMessage(SaveMessageRequest saveMessageRequest) {
		Integer userId = (Integer) (SecurityContextHolder.getContext().getAuthentication().getPrincipal());

		messageRepository.save(new Message(userId, saveMessageRequest.getReceiver(), saveMessageRequest.getText()));
	}

	public List<Message> retrieveMessages(Integer receiver) {
		Integer userId = (Integer) (SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		return messageRepository.findConversation(userId, receiver);
	}
	public List<Message> retrieveOpenedConversations() {
		Integer userId = (Integer) (SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		return messageRepository.findMessagesBySenderOrReceiver(userId);
	}
}
