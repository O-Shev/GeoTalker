package com.geotalker.core.dto.telegram.TObject;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.geotalker.core.dto.telegram.TObject.TChatType.TChatType;

public class TChat extends TObject {

    public final Long id;
    public final TChatType type;
    public final String title;
    public final Boolean hasProtectedContent;
    public final Boolean isTranslatable;
    public final Boolean isMarkedAsUnread;
    public final Boolean hasScheduledMessages;
    public final Boolean canBeDeletedOnlyForSelf;
    public final Boolean canBeDeletedForAllUsers;
    public final Boolean canBeReported;
    public final Boolean defaultDisableNotification;
    public final Integer unreadCount;
    public final Long lastReadInboxMessageId;
    public final Long lastReadOutboxMessageId;
    public final Integer unreadMentionCount;
    public final Integer unreadReactionCount;
    public final Integer messageAutoDeleteTime;
    public final String themeName;
    public final Long replyMarkupMessageId;
    public final String clientData;

    @JsonCreator
    public TChat(@JsonProperty("id") Long id,
                 @JsonProperty("type") TChatType type,
                 @JsonProperty("title") String title,
                 @JsonProperty("has_protected_content") Boolean hasProtectedContent,
                 @JsonProperty("is_translatable") Boolean isTranslatable,
                 @JsonProperty("is_marked_as_unread") Boolean isMarkedAsUnread,
                 @JsonProperty("has_scheduled_messages") Boolean hasScheduledMessages,
                 @JsonProperty("can_be_deleted_only_for_self") Boolean canBeDeletedOnlyForSelf,
                 @JsonProperty("can_be_deleted_for_all_users") Boolean canBeDeletedForAllUsers,
                 @JsonProperty("can_be_reported") Boolean canBeReported,
                 @JsonProperty("default_disable_notification") Boolean defaultDisableNotification,
                 @JsonProperty("unread_count") Integer unreadCount,
                 @JsonProperty("last_read_inbox_message_id") Long lastReadInboxMessageId,
                 @JsonProperty("last_read_outbox_message_id") Long lastReadOutboxMessageId,
                 @JsonProperty("unread_mention_count") Integer unreadMentionCount,
                 @JsonProperty("unread_reaction_count") Integer unreadReactionCount,
                 @JsonProperty("message_auto_delete_time") Integer messageAutoDeleteTime,
                 @JsonProperty("theme_name") String themeName,
                 @JsonProperty("reply_markup_message_id") Long replyMarkupMessageId,
                 @JsonProperty("client_data") String clientData) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.hasProtectedContent = hasProtectedContent;
        this.isTranslatable = isTranslatable;
        this.isMarkedAsUnread = isMarkedAsUnread;
        this.hasScheduledMessages = hasScheduledMessages;
        this.canBeDeletedOnlyForSelf = canBeDeletedOnlyForSelf;
        this.canBeDeletedForAllUsers = canBeDeletedForAllUsers;
        this.canBeReported = canBeReported;
        this.defaultDisableNotification = defaultDisableNotification;
        this.unreadCount = unreadCount;
        this.lastReadInboxMessageId = lastReadInboxMessageId;
        this.lastReadOutboxMessageId = lastReadOutboxMessageId;
        this.unreadMentionCount = unreadMentionCount;
        this.unreadReactionCount = unreadReactionCount;
        this.messageAutoDeleteTime = messageAutoDeleteTime;
        this.themeName = themeName;
        this.replyMarkupMessageId = replyMarkupMessageId;
        this.clientData = clientData;
    }

    @Override
    public String toString() {
        return "TChat{" +
                "id=" + id +
                ", type=" + type +
                ", title='" + title + '\'' +
                ", hasProtectedContent=" + hasProtectedContent +
                ", isTranslatable=" + isTranslatable +
                ", isMarkedAsUnread=" + isMarkedAsUnread +
                ", hasScheduledMessages=" + hasScheduledMessages +
                ", canBeDeletedOnlyForSelf=" + canBeDeletedOnlyForSelf +
                ", canBeDeletedForAllUsers=" + canBeDeletedForAllUsers +
                ", canBeReported=" + canBeReported +
                ", defaultDisableNotification=" + defaultDisableNotification +
                ", unreadCount=" + unreadCount +
                ", lastReadInboxMessageId=" + lastReadInboxMessageId +
                ", lastReadOutboxMessageId=" + lastReadOutboxMessageId +
                ", unreadMentionCount=" + unreadMentionCount +
                ", unreadReactionCount=" + unreadReactionCount +
                ", messageAutoDeleteTime=" + messageAutoDeleteTime +
                ", themeName='" + themeName + '\'' +
                ", replyMarkupMessageId=" + replyMarkupMessageId +
                ", clientData='" + clientData + '\'' +
                '}';
    }
}

