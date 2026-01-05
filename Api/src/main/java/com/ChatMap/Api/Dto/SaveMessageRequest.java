package com.ChatMap.Api.Dto;

public record SaveMessageRequest(String type, Integer receiver, String text) {
}
