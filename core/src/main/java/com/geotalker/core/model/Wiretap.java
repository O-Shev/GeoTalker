package com.geotalker.core.model;
import com.geotalker.core.model.locality.Locality;
import com.geotalker.core.model.enums.WiretapStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.sql.Timestamp;

@Entity
@Table(name = "wiretap", schema = "core")
public class Wiretap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "telegram_supergroup_id", referencedColumnName = "id"),
            @JoinColumn(name = "telegram_supergroup_api_id", referencedColumnName = "api_id")
    })
    private TelegramSupergroup telegramSupergroup;

    @ManyToOne
    @JoinColumn(name = "user_account_id")
    private UserAccount userAccount;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "locality_id")
    private Locality locality;


    @OneToOne(mappedBy = "wiretap", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private MappingInfo mappingInfo;

    @Column(name = "primary_interlink")
    private String primaryInterlink; //as url

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition="wiretap_status", nullable = false)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private WiretapStatus status;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    public Wiretap() {
    }


    public TelegramSupergroup getTelegramSupergroup() {
        return telegramSupergroup;
    }

    public void setTelegramSupergroup(TelegramSupergroup telegramSupergroup) {
        this.telegramSupergroup = telegramSupergroup;
    }

    public MappingInfo getMappingInfo() {
        return mappingInfo;
    }

    public void setMappingInfo(MappingInfo mappingInfo) {
        this.mappingInfo = mappingInfo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserAccount getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(UserAccount userAccount) {
        this.userAccount = userAccount;
    }

    public Locality getLocality() {
        return locality;
    }

    public void setLocality(Locality locality) {
        this.locality = locality;
    }

    public String getPrimaryInterlink() {
        return primaryInterlink;
    }

    public void setPrimaryInterlink(String primaryInterlink) {
        this.primaryInterlink = primaryInterlink;
    }

    public WiretapStatus getStatus() {
        return status;
    }

    public void setStatus(WiretapStatus status) {
        this.status = status;
    }


    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Wiretap{" +
                "id=" + id +
                ", tSupergroup=" + telegramSupergroup +
                ", userAccount=" + userAccount +
                ", locality=" + locality +
                ", mappingInfo=" + mappingInfo +
                ", primaryInterlink='" + primaryInterlink + '\'' +
                ", status=" + status +
                ", createdAt=" + createdAt +
                '}';
    }
}
