package com.geotalker.core.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "supergroup", schema = "telegram")
@IdClass(TelegramSupergroup.PK.class)
public class TelegramSupergroup {
    public enum ChatMemberStatus {
        chatMemberStatusCreator,
        chatMemberStatusAdministrator,
        chatMemberStatusMember,
        chatMemberStatusRestricted,
        chatMemberStatusLeft,
        chatMemberStatusBanned
    }

    public static class PK implements Serializable {

        private Long id;

        private Integer apiId;

        public PK() {
        }

        public PK(Long id, Integer apiId) {
            this.id = id;
            this.apiId = apiId;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Integer getApiId() {
            return apiId;
        }

        public void setApiId(Integer apiId) {
            this.apiId = apiId;
        }
    }


    @Id
    @Column(name = "id")
    private Long id;

    @Id
    @Column(name = "api_id")
    private Integer apiId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getApiId() {
        return apiId;
    }

    public void setApiId(Integer apiId) {
        this.apiId = apiId;
    }

    @Column(name = "chat_id")
    private Long chatId;

    @Column(name = "title")
    private String title;

    @Column(name = "profile_photo")
    private String profilePhoto;

    @Column(name = "member_count")
    private Integer memberCount;

    @Column(name = "username")
    private String username;

    @Column(name = "description", length = 250)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "member_status", columnDefinition="t_chat_member_status", nullable = false)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private ChatMemberStatus memberStatus;


    @Column(name = "has_linked_chat")
    private Boolean hasLinkedChat;

    @Column(name = "linked_chat_id")
    private Long linkedChatId;

    @Column(name = "is_channel")
    private Boolean isChannel;

    @Column(name = "is_broadcast_group")
    private Boolean isBroadcastGroup;

    @Column(name = "is_verified")
    private Boolean isVerified;

    @Column(name = "is_scam")
    private Boolean isScam;

    @Column(name = "is_fake")
    private Boolean isFake;

    @OneToMany(mappedBy = "supergroup")
    private List<TelegramMessage> messages;

    public TelegramSupergroup() {
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public Long getLinkedChatId() {
        return linkedChatId;
    }

    public void setLinkedChatId(Long linkedChatId) {
        this.linkedChatId = linkedChatId;
    }

    public Boolean getHasLinkedChat() {
        return hasLinkedChat;
    }

    public void setHasLinkedChat(Boolean hasLinkedChat) {
        this.hasLinkedChat = hasLinkedChat;
    }

    public List<TelegramMessage> getMessages() {
        return messages;
    }

    public void setMessages(List<TelegramMessage> messages) {
        this.messages = messages;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(Integer memberCount) {
        this.memberCount = memberCount;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ChatMemberStatus getMemberStatus() {
        return memberStatus;
    }

    public void setMemberStatus(ChatMemberStatus memberStatus) {
        this.memberStatus = memberStatus;
    }

    public Boolean getChannel() {
        return isChannel;
    }

    public void setChannel(Boolean channel) {
        isChannel = channel;
    }

    public Boolean getIsChannel() {
        return isChannel;
    }

    public void setIsChannel(Boolean channel) {
        isChannel = channel;
    }

    public Boolean getBroadcastGroup() {
        return isBroadcastGroup;
    }

    public void setBroadcastGroup(Boolean broadcastGroup) {
        isBroadcastGroup = broadcastGroup;
    }

    public Boolean getVerified() {
        return isVerified;
    }

    public void setVerified(Boolean verified) {
        isVerified = verified;
    }

    public Boolean getScam() {
        return isScam;
    }

    public void setScam(Boolean scam) {
        isScam = scam;
    }

    public Boolean getFake() {
        return isFake;
    }

    public void setFake(Boolean fake) {
        isFake = fake;
    }

    @Override
    public String toString() {
        return "TSupergroup{" +
                ", title='" + title + '\'' +
                ", memberCount=" + memberCount +
                ", username='" + username + '\'' +
                ", description='" + description + '\'' +
                ", memberStatus=" + memberStatus +
                ", hasLinkedChat=" + hasLinkedChat +
                ", isChannel=" + isChannel +
                ", isBroadcastGroup=" + isBroadcastGroup +
                ", isVerified=" + isVerified +
                ", isScam=" + isScam +
                ", isFake=" + isFake +
                '}';
    }
}

