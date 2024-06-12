package com.geotalker.core.model;


import jakarta.persistence.*;

@Entity
@Table(name = "mapping_info", schema = "core")
public class MappingInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "wiretap_id", nullable = false)
    private Wiretap wiretap;

    @Column(name = "title", length = 250)
    private String title;

    @Column(name = "member_count")
    private Integer memberCount;

    @Column(name = "username", length = 50)
    private String username;

    @Column(name = "description", length = 250)
    private String description;

    @Column(name = "is_channel")
    private Boolean isChannel;

    public MappingInfo() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Boolean getIsChannel() {
        return isChannel;
    }

    public void setIsChannel(Boolean channel) {
        isChannel = channel;
    }

    public Wiretap getWiretap() {
        return wiretap;
    }

    public void setWiretap(Wiretap wiretap) {
        this.wiretap = wiretap;
    }

    @Override
    public String toString() {
        return "MappingInfo{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", memberCount=" + memberCount +
                ", username='" + username + '\'' +
                ", description='" + description + '\'' +
                ", isChannel=" + isChannel +
                '}';
    }
}

