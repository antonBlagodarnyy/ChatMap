package com.example.ChatMap.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "users_locations")
public class UserLocation {

	@Id
	private Integer id;

	private Double latitude;
	private Double longitude;

	public UserLocation() {
		super();
	}

	public UserLocation(Integer id, Double latitude, Double longitude) {
		super();
		this.id = id;
		this.latitude = latitude;
		this.longitude = longitude;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	@Override
	public String toString() {
		return "UserLocation [id=" + id + ", latitude=" + latitude + ", longitude=" + longitude + "]";
	}

	@OneToOne
	@MapsId
	@JoinColumn(name = "id", referencedColumnName = "id", unique = true)
	private User user;
	
	public void setUser(User user) {
        this.user = user;
    }
}
