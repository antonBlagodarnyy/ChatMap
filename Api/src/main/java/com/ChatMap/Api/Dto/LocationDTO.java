package com.ChatMap.Api.Dto;

public record LocationDTO(Integer id,
                          Double latitude,
                          Double longitude,
                          String username) {
}
