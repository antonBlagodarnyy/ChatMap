package com.example.ChatMap.Entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private String email;
	private String password;
	private String username;

	@OneToOne(mappedBy = "user",cascade = CascadeType.ALL)
	private UserLocation userLocation;
	
	// Messages sent by this user
	@JsonManagedReference
    @OneToMany(mappedBy = "sender")
    private List<Message> sentMessages;

    // Messages received by this user
	@JsonManagedReference
    @OneToMany(mappedBy = "receiver")
    private List<Message> receivedMessages;
    
	public User() {
		super();
	}

	public User(String email, String password, String username) {
		super();
		this.username = username;
		this.email = email;
		this.password = password;

	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUsername() {
		return this.username;
	}

	public void setUsername(String name) {
		this.username = name;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", email=" + email + ", password=" + password + ", username=" + username + "]";
	}

	public void setLocation(UserLocation location) {
        this.userLocation = location;
        if (location != null) {
            location.setUser(this);
        }
    }
	
	public List<Message> getSentMessages() {
		return sentMessages;
	}

	public void setSentMessages(List<Message> sentMessages) {
		this.sentMessages = sentMessages;
	}

	public List<Message> getReceivedMessages() {
		return receivedMessages;
	}

	public void setReceivedMessages(List<Message> receivedMessages) {
		this.receivedMessages = receivedMessages;
	}

	
	
	

}
