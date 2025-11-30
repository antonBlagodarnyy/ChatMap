package com.ChatMap.Message.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ChatMap.Message.Entities.Message;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    @Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1) ORDER BY m.ts ASC")
    List<Message> findConversation(@Param("user1") Integer user1, @Param("user2") Integer user2);
    
    @Query("""
    		  SELECT m FROM Message m 
    			WHERE m.id IN (
    				    SELECT MAX(m2.id) 
    				    FROM Message m2 
    				    WHERE m2.sender = :userId OR m2.receiver = :userId
    				    GROUP BY 
    				        CASE 
    				            WHEN m2.sender = :userId THEN m2.receiver
    				            ELSE m2.sender
    				        END
    						)
    					ORDER BY m.ts DESC
    		 """)
    List<Message> findMessagesBySenderOrReceiver(@Param("userId") Integer userId);
}
