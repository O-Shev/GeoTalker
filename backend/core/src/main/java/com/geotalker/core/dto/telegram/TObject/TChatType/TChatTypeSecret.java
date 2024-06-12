package com.geotalker.core.dto.telegram.TObject.TChatType;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TChatTypeSecret extends TChatType{


    public final Long secretChatId;
    public final Long userId;

    @JsonCreator
    public TChatTypeSecret(@JsonProperty("secret_chat_id") Long secretChatId,
                           @JsonProperty("user_id") Long userId) {

        this.secretChatId = secretChatId;
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "TChatTypeSecret{" +
                "secretChatId=" + secretChatId +
                ", userId=" + userId +
                '}';
    }
}
