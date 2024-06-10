package com.geotalker.core.dto.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.geotalker.core.model.TelegramMessage;

import java.sql.Timestamp;

public record TelegramMessageDTO(Long id,
                                 TelegramMessage.MessageContentType contentType,
                                 Sender sender,
                                 Timestamp date,
                                 Timestamp editDate,
                                 Boolean pinned,
                                 Long replyToMessageId,
                                 Boolean isReplyToThisChat,
                                 Long mediaAlbumId,
                                 JsonNode content) {

    public record Sender(Type type,
                         String name,
                         String avatar){
        public enum Type {
            CURRENT_CHAT,
            ANOTHER_CHAT,
            USER
        }
    }
}
