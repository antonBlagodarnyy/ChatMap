package com.ChatMap.Message.Services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ChatMap.Message.Dto.ChatPreviewResDTO;
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
		return messageRepository.findMessagesBetweenTwoUsers(userId, receiver);
	}
	public List<ChatPreviewResDTO> retrieveOpenedConversations() {
		Integer userId = (Integer) (SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		
		List<Message> messages = messageRepository.findConversartions(userId);
		 
		List<ChatPreviewResDTO> previews = messages.stream()
		        .map(m -> {
		            Integer partnerId = m.getSender().equals(userId) 
		                    ? m.getReceiver() 
		                    : m.getSender();
		            return new ChatPreviewResDTO(partnerId, m);
		        })
		        .collect(Collectors.toList());
		
		return previews;
	}
}
