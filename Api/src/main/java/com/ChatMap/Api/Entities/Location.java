package com.ChatMap.Api.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Locations")
public class Location {

	@Id
	private Integer id;

	@Column(nullable = false)
	private Double latitude;

	@Column(nullable = false)
	private Double longitude;

	@OneToOne
	@MapsId
	@JoinColumn(name = "id")
	private User user;

	public Location() {
		super();
	}

	public Location(Integer id, Double latitude, Double longitude) {
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

}
