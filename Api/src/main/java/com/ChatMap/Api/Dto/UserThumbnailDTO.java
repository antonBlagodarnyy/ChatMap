package com.ChatMap.Api.Dto;

public record UserThumbnailDTO(Integer id,
                               String username,
                               String address,
                               Double lat,
                               Double lon) {
}
