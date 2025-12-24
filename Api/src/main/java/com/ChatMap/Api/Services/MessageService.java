package com.ChatMap.Api.Services;


import com.ChatMap.Api.Dto.ChatPreviewResDTO;
import com.ChatMap.Api.Dto.SaveMessageRequest;
import com.ChatMap.Api.Entities.Message;
import com.ChatMap.Api.Entities.User;
import com.ChatMap.Api.Models.CustomUserDetails;
import com.ChatMap.Api.Repositories.MessageRepository;
import com.ChatMap.Api.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserRepository userRepository;

    public void saveMessage(SaveMessageRequest saveMessageRequest) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User sender = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        User receiver = userRepository.findById(saveMessageRequest.getReceiver())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("Sender and receiver cannot be the same");
        }

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setText(saveMessageRequest.getText());

        messageRepository.save(message);
    }

    public List<Message> retrieveMessages(Integer receiver) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return messageRepository.findMessagesBetweenTwoUsers(Integer.parseInt(userDetails.getUsername()), receiver);
    }

    public List<ChatPreviewResDTO> retrieveOpenedConversations() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User currentUser = userRepository.findById(Integer.parseInt(userDetails.getUsername()))
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Message> messages = messageRepository.findConversartions(Integer.parseInt(userDetails.getUsername()));

        return messages.stream()
                .map(m -> {
                    User partner = m.getSender().equals(currentUser)
                            ? m.getReceiver()
                            : m.getSender();
                    return new ChatPreviewResDTO(partner.getUsername(), partner.getId(), m);
                })
                .collect(Collectors.toList());
    }
}
