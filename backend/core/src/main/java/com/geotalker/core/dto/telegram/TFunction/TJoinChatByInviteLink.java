package com.geotalker.core.dto.telegram.TFunction;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TJoinChatByInviteLink extends TFunction{
    public final String inviteLink;

    public TJoinChatByInviteLink(@JsonProperty("invite_link") String inviteLink) {
        this.inviteLink = inviteLink;
    }
}
