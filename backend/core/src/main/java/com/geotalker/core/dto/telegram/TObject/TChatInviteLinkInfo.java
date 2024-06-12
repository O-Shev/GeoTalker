package com.geotalker.core.dto.telegram.TObject;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.geotalker.core.dto.telegram.TObject.TChatType.TChatType;

public class TChatInviteLinkInfo extends TObject {

    public final Long chatId;
    public final Integer accessibleFor;
    public final TChatType type;
    public final String title;
    public final TChatPhotoInfo photo;
    public final String description;
    public final Integer memberCount;
    public final Boolean createsJoinRequest;
    public final Boolean isPublic;
    public final Boolean isVerified;
    public final Boolean isScam;
    public final Boolean isFake;

    @JsonCreator
    public TChatInviteLinkInfo(@JsonProperty("chat_id") Long chatId,
                               @JsonProperty("accessible_for") Integer accessibleFor,
                               @JsonProperty("type") TChatType type,
                               @JsonProperty("title") String title,
                               @JsonProperty("photo") TChatPhotoInfo photo,
                               @JsonProperty("description") String description,
                               @JsonProperty("member_count") int memberCount,
                               @JsonProperty("creates_join_request")Boolean createsJoinRequest,
                               @JsonProperty("is_public") Boolean isPublic,
                               @JsonProperty("is_verified") Boolean isVerified,
                               @JsonProperty("is_scam") Boolean isScam,
                               @JsonProperty("is_fake") Boolean isFake) {
        this.chatId = chatId;
        this.type = type;
        this.accessibleFor = accessibleFor;
        this.title = title;
        this.photo=photo;
        this.description = description;
        this.memberCount = memberCount;
        this.createsJoinRequest = createsJoinRequest;
        this.isPublic = isPublic;
        this.isVerified = isVerified;
        this.isScam = isScam;
        this.isFake = isFake;
    }


    @Override
    public String toString() {
        return "TChatInviteLinkInfo{" +
                "chatId=" + chatId +
                ", accessibleFor=" + accessibleFor +
                ", type=" + type +
                ", title='" + title + '\'' +
                ", photo=" + photo +
                ", description='" + description + '\'' +
                ", memberCount=" + memberCount +
                ", createsJoinRequest=" + createsJoinRequest +
                ", isPublic=" + isPublic +
                ", isVerified=" + isVerified +
                ", isScam=" + isScam +
                ", isFake=" + isFake +
                '}';
    }
}
