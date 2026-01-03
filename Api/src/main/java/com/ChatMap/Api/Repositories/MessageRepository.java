package com.ChatMap.Api.Repositories;

import com.ChatMap.Api.Dto.ChatPreviewResponse;
import com.ChatMap.Api.Dto.MessageDTO;
import com.ChatMap.Api.Dto.SavedMessageDTO;
import com.ChatMap.Api.Entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    @Query("""
             SELECT new com.ChatMap.Api.Dto.SavedMessageDTO(
                         new com.ChatMap.Api.Dto.MessageDTO(
                             m.sender.username,
                             m.sender.id,
                             m.receiver.username,
                             m.receiver.id,
                             m.text,
                             m.ts,
                             m.isRead))
                        FROM Message m
             WHERE (m.sender.id = :user1 AND m.receiver.id = :user2)
                 OR (m.sender.id = :user2 AND m.receiver.id = :user1)
             ORDER BY m.ts ASC
            """)
    List<SavedMessageDTO> findMessagesBetweenTwoUsers(@Param("user1") Integer user1, @Param("user2") Integer user2);

    @Query("""
                SELECT new com.ChatMap.Api.Dto.ChatPreviewResponse(
                    new com.ChatMap.Api.Dto.MessageDTO(
                            m.sender.username,
                            m.sender.id,
                            m.receiver.username,
                            m.receiver.id,
                            m.text,
                            m.ts,
                            m.isRead),
                          CASE
                            WHEN m.sender.id = :userId THEN m.receiver.id
                            ELSE m.sender.id
                          END,
                          CASE
                             WHEN m.sender.id = :userId THEN m.receiver.username
                             ELSE m.sender.username
                          END,
                        (
                            SELECT COUNT(m3)
                            FROM Message m3
                            WHERE m3.receiver.id = :userId
                              AND m3.isRead = false
                              AND (
                                   (m3.sender.id = m.sender.id AND m3.receiver.id = m.receiver.id)
                                OR (m3.sender.id = m.receiver.id AND m3.receiver.id = m.sender.id)
                              )
                        )
                    )
                    FROM Message m
                    WHERE m.id IN (
                        SELECT MAX(m2.id)
                        FROM Message m2
                        WHERE m2.sender.id = :userId OR m2.receiver.id = :userId
                        GROUP BY
                            CASE
                                WHEN m2.sender.id = :userId THEN m2.receiver.id
                                ELSE m2.sender.id
                            END
                    )
                ORDER BY m.ts DESC
            """)
    List<ChatPreviewResponse> findConversationsWithUnreadCount(@Param("userId") Integer userId);

    @Modifying
    @Transactional
    @Query("UPDATE Message m SET m.isRead = true WHERE m.receiver.id = :userId AND m.sender.id = :partnerId")
    void markAsRead(Integer userId, Integer partnerId);

}
