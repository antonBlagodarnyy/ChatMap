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
import java.util.Objects;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserRepository userRepository;

    public SavedMessageDTO saveMessage(SaveMessageRequest saveMessageRequest) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User sender = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        User receiver = userRepository.findById(saveMessageRequest.receiver())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("Sender and receiverId cannot be the same");
        }

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setText(saveMessageRequest.text());
        Message savedMsg = messageRepository.save(message);

        return new SavedMessageDTO(
                new MessageDTO(
                        savedMsg.getSender().getUsername(),
                        savedMsg.getSender().getId(),
                        savedMsg.getReceiver().getUsername(),
                        savedMsg.getReceiver().getId(),
                        savedMsg.getText(),
                        savedMsg.getTs(),
                        savedMsg.isRead()));
    }


    /*TODO isRead is sent. Should now:
    1. Be received check
    2. Show badge check
    3. Update status once they are read check
    4. Implement ws
    5. Implement same in chatHistory
    */
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
                        receiver));

    }

    public List<ChatPreviewResponse> retrieveOpenedConversations() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return messageRepository.findConversationsWithUnreadCount(userDetails.getId());
    }

    public void markMessagesAsRead(Integer partnerId) {
        System.out.println(partnerId);
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        messageRepository.markAsRead(userDetails.getId(), partnerId);
    }

}
