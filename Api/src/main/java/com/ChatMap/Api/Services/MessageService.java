package com.ChatMap.Api.Services;


import com.ChatMap.Api.Dto.*;
import com.ChatMap.Api.Entities.Message;
import com.ChatMap.Api.Entities.User;
import com.ChatMap.Api.Models.CustomUserDetails;
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
    @Autowired
    private UserRepository userRepository;

    public SaveMessageResponse saveMessage(SaveMessageRequest saveMessageRequest) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User sender = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        User receiver = userRepository.findById(saveMessageRequest.receiver())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("Sender and receiver cannot be the same");
        }

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setText(saveMessageRequest.text());
        Message savedMsg = messageRepository.save(message);

        return new SaveMessageResponse(
                savedMsg.getSender().getUsername(),
                savedMsg.getReceiver().getId(),
                savedMsg.getText(),
                savedMsg.getTs());
    }

    public RetrieveMessagesResponse retrieveMessages(Integer receiver) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));


        return new RetrieveMessagesResponse(
                messageRepository.findMessagesBetweenTwoUsers(
                                currentUser.getId(),
                                receiver)
                        .stream()
                        .map(m -> new MessageDTO(
                                m.getSender().getUsername(),
                                m.getReceiver().getId(),
                                m.getText(),
                                m.getTs()))
                        .toList());

    }

    public List<ChatPreviewResponse> retrieveOpenedConversations() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Message> messages = messageRepository.findConversartions(userDetails.getId());

        return messages.stream()
                .map(m -> {
                    User partner = m.getSender().equals(currentUser)
                            ? m.getReceiver()
                            : m.getSender();
                    return new ChatPreviewResponse(
                            partner.getUsername(),
                            partner.getId(),
                            new MessageDTO(
                                    m.getSender().getUsername(),
                                    m.getReceiver().getId(),
                                    m.getText(),
                                    m.getTs()));
                })
                .collect(Collectors.toList());
    }
}
