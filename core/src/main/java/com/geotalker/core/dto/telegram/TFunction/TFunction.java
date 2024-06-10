package com.geotalker.core.dto.telegram.TFunction;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.geotalker.core.dto.telegram.TlObject;

@JsonSubTypes({
        @JsonSubTypes.Type(value = TCheckChatInviteLink.class, name = "checkChatInviteLink"),
        @JsonSubTypes.Type(value = TSearchPublicChat.class, name = "searchPublicChat"),
        @JsonSubTypes.Type(value = TJoinChatByInviteLink.class, name = "joinChatByInviteLink"),
        @JsonSubTypes.Type(value = TJoinChat.class, name = "joinChat"),
        @JsonSubTypes.Type(value = TGetChat.class, name = "getChat")
})
public abstract class TFunction extends TlObject {
}
