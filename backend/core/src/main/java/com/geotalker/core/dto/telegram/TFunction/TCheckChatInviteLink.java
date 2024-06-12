package com.geotalker.core.dto.telegram.TFunction;


import com.fasterxml.jackson.annotation.JsonProperty;

public class TCheckChatInviteLink extends TFunction {
    public final String inviteLink;

    public TCheckChatInviteLink(@JsonProperty("invite_link") String inviteLink) {
        this.inviteLink = inviteLink;
    }
}
