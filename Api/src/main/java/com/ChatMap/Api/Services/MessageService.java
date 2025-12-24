package com.ChatMap.Api.Services;


import com.ChatMap.Api.Dto.ChatPreviewResDTO;
import com.ChatMap.Api.Dto.SaveMessageRequest;
import com.ChatMap.Api.Entities.Message;
import com.ChatMap.Api.Entities.User;
import com.ChatMap.Api.Repositories.MessageRepository;
import com.ChatMap.Api.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

	@Autowired
	private MessageRepository messageRepository;
	private UserRepository userRepository;

	public void saveMessage(SaveMessageRequest saveMessageRequest) {
		Integer userId = (Integer) SecurityContextHolder
				.getContext()
				.getAuthentication()
				.getPrincipal();

		//TODO handle exceptions
		User sender = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));

		User receiver = userRepository.findById(saveMessageRequest.getReceiver())
				.orElseThrow(() -> new RuntimeException("Receiver not found"));

		if (sender.getId().equals(receiver.getId())) {
			throw new IllegalArgumentException("Sender and receiver cannot be the same");
		}

		Message message = new Message();
		message.setSender(sender.getId());
		message.setReceiver(receiver.getId());
		message.setText(saveMessageRequest.getText());

		messageRepository.save(message);
	}
	public List<Message> retrieveMessages(Integer receiver) {
		Integer userId = (Integer) (SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		return messageRepository.findMessagesBetweenTwoUsers(userId, receiver);
	}
	public List<ChatPreviewResDTO> retrieveOpenedConversations() {
		Integer userId = (Integer) (SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		
		List<Message> messages = messageRepository.findConversartions(userId);

        return messages.stream()
                .map(m -> {
                    Integer partnerId = m.getSender().equals(userId)
                            ? m.getReceiver()
                            : m.getSender();
                    return new ChatPreviewResDTO(partnerId, m);
                })
                .collect(Collectors.toList());
	}
}
