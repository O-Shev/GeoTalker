package com.geotalker.core.dto.telegram.TFunction;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TGetChat extends TFunction{
    public final Long chatId;
    public TGetChat(@JsonProperty("chat_id") Long chatId) {
        this.chatId = chatId;
    }
}