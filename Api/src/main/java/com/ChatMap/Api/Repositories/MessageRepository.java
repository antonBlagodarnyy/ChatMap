package com.ChatMap.Api.Repositories;

import com.ChatMap.Api.Entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    @Query("SELECT m FROM Message m " +
			"WHERE (m.sender.id = :user1 AND m.receiver.id = :user2) " +
			"OR (m.sender.id = :user2 AND m.receiver.id = :user1) " +
			"ORDER BY m.ts ASC")
    List<Message> findMessagesBetweenTwoUsers(@Param("user1") Integer user1, @Param("user2") Integer user2);

    @Query("""
    		  SELECT m FROM Message m 
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
    List<Message> findConversartions(@Param("userId") Integer userId);
}
