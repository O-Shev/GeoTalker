package com.geotalker.core.dto.telegram.TFunction;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TJoinChat extends TFunction{
    public final Long chatId;
    public TJoinChat(@JsonProperty("chat_id") Long chatId) {
        this.chatId = chatId;
    }
}
