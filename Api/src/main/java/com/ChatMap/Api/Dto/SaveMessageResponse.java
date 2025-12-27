package com.ChatMap.Api.Dto;

import java.util.Date;

public record SaveMessageResponse(String type,
                                  String sender,
                                  Integer receiver,
                                  String text,
                                  Date ts) {
    public SaveMessageResponse(String sender,
                               Integer receiver,
                               String text,
                               Date ts) {
        this("SAVED", sender, receiver, text, ts);
    }
}
