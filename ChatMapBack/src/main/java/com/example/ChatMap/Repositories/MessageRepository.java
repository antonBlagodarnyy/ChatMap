package com.example.ChatMap.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ChatMap.Entities.Message;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {

    // Find messages where a specific user is the sender
    List<Message> findBySenderId(Integer senderId);

    // Find messages where a specific user is the receiver
    List<Message> findByReceiverId(Integer receiverId);

    // Find messages where the user is either sender or receiver
    List<Message> findBySenderIdOrReceiverId(Integer senderId, Integer receiverId);
}