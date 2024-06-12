package com.geotalker.core.security;

import com.geotalker.core.model.UserAccount;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserAccountDetails implements UserDetails {

    private final UserAccount userAccount;

    public UserAccountDetails(UserAccount userAccount) {
        this.userAccount = userAccount;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.userAccount.getRole().name()));
    }

    @Override
    public String getPassword() {
        return this.userAccount.getPassword();
    }

    @Override
    public String getUsername() {
        return this.userAccount.getName();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
