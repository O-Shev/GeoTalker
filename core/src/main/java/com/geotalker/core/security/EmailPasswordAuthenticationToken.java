package com.geotalker.core.security;

import com.geotalker.core.dto.client.form.UserAccountLoginDTO;
import com.geotalker.core.model.UserAccount;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class EmailPasswordAuthenticationToken extends AbstractAuthenticationToken {
    private final UserAccount principal;
    private UserAccountLoginDTO credentials;

    private EmailPasswordAuthenticationToken(UserAccount principal, UserAccountLoginDTO credentials) {
        super(null);
        this.principal = principal;
        this.credentials = credentials;
        this.setAuthenticated(false);
    }

    private EmailPasswordAuthenticationToken(UserAccount principal, UserAccountLoginDTO credentials, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        this.credentials = credentials;
        super.setAuthenticated(true);
    }

    public static EmailPasswordAuthenticationToken unauthenticated(UserAccountLoginDTO credentials) {
        return new EmailPasswordAuthenticationToken(null, credentials);
    }

    public static EmailPasswordAuthenticationToken authenticated(UserAccount principal, UserAccountLoginDTO credentials, Collection<? extends GrantedAuthority> authorities) {
        return new EmailPasswordAuthenticationToken(principal, credentials, authorities);
    }

    @Override
    public UserAccountLoginDTO getCredentials() {
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
