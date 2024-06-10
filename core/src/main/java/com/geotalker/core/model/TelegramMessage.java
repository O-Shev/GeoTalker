package com.geotalker.core.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.sql.Timestamp;

@Entity
@Table(name = "message", schema = "telegram")
public class TelegramMessage {
    @Transient
    Wiretap wiretap;

    public enum MessageSenderType {
        messageSenderUser,
        messageSenderChat
    }

    public enum MessageContentType {
        messageAnimatedEmoji,
        messageAnimation,
        messageAudio,
        messageBasicGroupChatCreate,
        messageCall,
        messageChatAddMembers,
        messageChatChangePhoto,
        messageChatChangeTitle,
        messageChatDeleteMember,
        messageChatDeletePhoto,
        messageChatJoinByLink,
        messageChatJoinByRequest,
        messageChatSetTheme,
        messageChatSetTtl,
        messageChatUpgradeFrom,
        messageChatUpgradeTo,
        messageContact,
        messageContactRegistered,
        messageCustomServiceAction,
        messageDice,
        messageDocument,
        messageExpiredPhoto,
        messageExpiredVideo,
        messageGame,
        messageGameScore,
        messageInviteVideoChatParticipants,
        messageInvoice,
        messageLocation,
        messagePassportDataReceived,
        messagePassportDataSent,
        messagePaymentSuccessful,
        messagePaymentSuccessfulBot,
        messagePhoto,
        messagePinMessage,
        messagePoll,
        messageProximityAlertTriggered,
        messageScreenshotTaken,
        messageSticker,
        messageSupergroupChatCreate,
        messageText,
        messageUnsupported,
        messageVenue,
        messageVideo,
        messageVideoChatEnded,
        messageVideoChatScheduled,
        messageVideoChatStarted,
        messageVideoNote,
        messageVoiceNote,
        messageWebsiteConnected
    }

    @Id
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumns({
            @JoinColumn(name = "api_id", referencedColumnName = "api_id"),
            @JoinColumn(name = "chat_id", referencedColumnName = "chat_id"),
    })
    private TelegramSupergroup supergroup;

    public TelegramMessage() {
    }

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(name = "sender_type")
    private MessageSenderType senderType;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_type")
    private MessageContentType contentType;

    @Column(name = "sender_id")
    private Long senderId;

    @Column(name = "date")
    private Timestamp date;

    @Column(name = "edit_date")
    private Timestamp editDate;

    @Column(name = "is_pinned")
    private Boolean pinned;

    @Column(name = "is_channel_post")
    private Boolean isChannelPost;

    @Column(name = "reply_to_chat_id")
    private Long replyToChatId;

    @Column(name = "reply_to_message_id")
    private Long replyToMessageId;

    @Column(name = "message_thread_id")
    private Long messageThreadId;

    @Column(name = "media_album_id")
    private Long mediaAlbumId;

    @Column(name = "view_count")
    private Integer viewCount;

    @Column(name = "forward_count")
    private Integer forwardCount;

    @Column(name = "content", columnDefinition = "jsonb")
    private String content;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TelegramSupergroup getSupergroup() {
        return supergroup;
    }

    public void setSupergroup(TelegramSupergroup supergroup) {
        this.supergroup = supergroup;
    }

    public MessageSenderType getSenderType() {
        return senderType;
    }

    public void setSenderType(MessageSenderType senderType) {
        this.senderType = senderType;
    }

    public MessageContentType getContentType() {
        return contentType;
    }

    public void setContentType(MessageContentType contentType) {
        this.contentType = contentType;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public Timestamp getEditDate() {
        return editDate;
    }

    public void setEditDate(Timestamp editDate) {
        this.editDate = editDate;
    }

    public Boolean getPinned() {
        return pinned;
    }

    public void setPinned(Boolean pinned) {
        this.pinned = pinned;
    }

    public Boolean getIsChannelPost() {
        return isChannelPost;
    }

    public void setIsChannelPost(Boolean isChannelPost) {
        this.isChannelPost = isChannelPost;
    }

    public Long getReplyToChatId() {
        return replyToChatId;
    }

    public void setReplyToChatId(Long replyToChatId) {
        this.replyToChatId = replyToChatId;
    }

    public Long getReplyToMessageId() {
        return replyToMessageId;
    }

    public void setReplyToMessageId(Long replyToMessageId) {
        this.replyToMessageId = replyToMessageId;
    }

    public Long getMessageThreadId() {
        return messageThreadId;
    }

    public void setMessageThreadId(Long messageThreadId) {
        this.messageThreadId = messageThreadId;
    }

    public Long getMediaAlbumId() {
        return mediaAlbumId;
    }

    public void setMediaAlbumId(Long mediaAlbumId) {
        this.mediaAlbumId = mediaAlbumId;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public Integer getForwardCount() {
        return forwardCount;
    }

    public void setForwardCount(Integer forwardCount) {
        this.forwardCount = forwardCount;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Wiretap getWiretap() {
        return wiretap;
    }

    public void setWiretap(Wiretap wiretap) {
        this.wiretap = wiretap;
    }

    public Boolean getChannelPost() {
        return isChannelPost;
    }

    public void setChannelPost(Boolean channelPost) {
        isChannelPost = channelPost;
    }
}
