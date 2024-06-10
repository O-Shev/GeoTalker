package com.geotalker.core.security;

import com.geotalker.core.dto.client.form.UserAccountOAuth2DTO;
import com.geotalker.core.model.UserAccount;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class OAuth2AuthenticationToken extends AbstractAuthenticationToken {
    private final UserAccount principal;
    private UserAccountOAuth2DTO credentials;


    private OAuth2AuthenticationToken(UserAccount principal, UserAccountOAuth2DTO credentials) {
        super(null);
        this.principal = principal;
        this.credentials = credentials;
        this.setAuthenticated(false);
    }

    private OAuth2AuthenticationToken(UserAccount principal, UserAccountOAuth2DTO credentials, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        this.credentials = credentials;
        super.setAuthenticated(true);
    }

    public static OAuth2AuthenticationToken unauthenticated(UserAccountOAuth2DTO credentials) {
        return new OAuth2AuthenticationToken(null, credentials);
    }

    public static OAuth2AuthenticationToken authenticated(UserAccount principal, UserAccountOAuth2DTO credentials, Collection<? extends GrantedAuthority> authorities) {
        return new OAuth2AuthenticationToken(principal, credentials, authorities);
    }

    @Override
    public UserAccountOAuth2DTO getCredentials() {
        return credentials;
    }

    @Override
    public UserAccount getPrincipal() {
        return principal;
    }

    public void eraseCredentials() {
        super.eraseCredentials();
        this.credentials = null;
    }
}
