package com.ChatMap.Api.Dto;

import java.util.Date;

public record MessageDTO(String sender, Integer receiver, String text, Date ts) {
}
