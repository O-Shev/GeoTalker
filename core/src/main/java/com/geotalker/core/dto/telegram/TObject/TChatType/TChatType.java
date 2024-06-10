package com.geotalker.core.dto.telegram.TObject.TChatType;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.geotalker.core.dto.telegram.TObject.TObject;


@JsonSubTypes({
        @JsonSubTypes.Type(value = TChatTypeBasicGroup.class, name = "chatTypeBasicGroup"),
        @JsonSubTypes.Type(value = TChatTypePrivate.class, name = "chatTypePrivate"),
        @JsonSubTypes.Type(value = TChatTypeSecret.class, name = "chatTypeSecret"),
        @JsonSubTypes.Type(value = TChatTypeSupergroup.class, name = "chatTypeSupergroup"),
        @JsonSubTypes.Type(value = TInviteLinkChatTypeSupergroup.class, name = "inviteLinkChatTypeSupergroup"),
        @JsonSubTypes.Type(value = TInviteLinkChatTypeSupergroup.class, name = "inviteLinkChatTypeChannel")
})
public abstract class TChatType extends TObject {

}
