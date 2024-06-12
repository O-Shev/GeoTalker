package com.geotalker.core.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.List;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="user_account", schema = "core")
public class UserAccount {

    public enum UserRole {
        ROOT,
        ADMIN,
        SUPER_USER,
        USER
    }

    public enum Provider {
        GOOGLE,
        LOCAL
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "password")
    private String password;

    @Column(name = "email")
    private String email;

    @Column(name = "profile_photo")
    private String profilePhoto;

    @Column(name = "verified")
    private Boolean verified;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", columnDefinition="user_account_role", nullable = false)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private UserRole role;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", columnDefinition="user_account_provider", nullable = false)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private Provider provider;



    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.getRole().name()));
    }

}