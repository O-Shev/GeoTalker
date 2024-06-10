package com.geotalker.core.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.geotalker.core.dto.client.TelegramMessageDTO;
import com.geotalker.core.model.TelegramMessage;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Objects;

@Mapper(componentModel = "spring")
public abstract class TelegramMessageMapper {
    @Autowired
    protected TelegramMessageFaker telegramMessageFaker;

    @Mapping(target = "isReplyToThisChat", expression = "java(toIsReplyToThisChat(telegramMessage))")
    @Mapping(target = "sender", expression = "java(toSender(telegramMessage))")
    public abstract TelegramMessageDTO toDto(TelegramMessage telegramMessage);

    protected Boolean toIsReplyToThisChat(TelegramMessage telegramMessage){
        if(telegramMessage.getReplyToChatId() == null) return null;
        return telegramMessage.getSupergroup().getChatId().equals(telegramMessage.getReplyToChatId());
    }

    protected JsonNode toContent(String content) {
        if (content == null) return null;
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readTree(content);
        } catch (Exception e) {
            return null;
        }
    }

    protected TelegramMessageDTO.Sender toSender(TelegramMessage telegramMessage){
        TelegramMessageDTO.Sender.Type senderType;

        boolean isUserMessage = Objects.equals(telegramMessage.getSenderType(), TelegramMessage.MessageSenderType.messageSenderUser);
        boolean isChannelPost = telegramMessage.getIsChannelPost();
        boolean isSameChat = Objects.equals(telegramMessage.getWiretap().getTelegramSupergroup().getChatId(), telegramMessage.getSenderId());

        if (isUserMessage) senderType = TelegramMessageDTO.Sender.Type.USER;
        else if (isChannelPost || isSameChat) senderType = TelegramMessageDTO.Sender.Type.CURRENT_CHAT;
        else senderType = TelegramMessageDTO.Sender.Type.ANOTHER_CHAT;

        if(senderType == TelegramMessageDTO.Sender.Type.CURRENT_CHAT){
            return new TelegramMessageDTO.Sender(
                    senderType,
                    null,
                    null
            );
        } else {
            TelegramMessageFaker.FakeUser fakeUser = telegramMessageFaker.getFakeUser(
                    telegramMessage.getSenderId(),
                    telegramMessage.getWiretap().getId()
            );
            return new TelegramMessageDTO.Sender(
                    senderType,
                    fakeUser.name(),
                    fakeUser.avatar()
            );
        }

    }

}
