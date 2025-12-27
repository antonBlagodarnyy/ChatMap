package com.ChatMap.Api.Dto;

public record AddressDTO(Address address) {
    public record Address(String city, String country) {
    }
}
