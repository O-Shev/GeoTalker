package com.geotalker.core.security;

import com.geotalker.core.dto.client.form.UserAccountLoginDTO;
import com.geotalker.core.model.UserAccount;
import com.geotalker.core.service.UserAccountService;
import com.geotalker.core.util.UserAccountNotVerifiedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.util.Optional;

public class EmailPasswordAuthenticationProvider implements AuthenticationProvider {
    private final UserAccountService userAccountService;
    private final PasswordEncoder passwordEncoder;

    public EmailPasswordAuthenticationProvider(UserAccountService userAccountService,
                                               PasswordEncoder passwordEncoder) {
        this.userAccountService = userAccountService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        UserAccountLoginDTO userAccountLoginDTO = (UserAccountLoginDTO) authentication.getCredentials();
        Optional<UserAccount> optionalUserAccount = userAccountService.loadUserAccountByEmail(userAccountLoginDTO.email());
        if(optionalUserAccount.isEmpty())
            throw new AuthenticationCredentialsNotFoundException("");

        if(!passwordEncoder.matches(userAccountLoginDTO.password(), optionalUserAccount.get().getPassword()))
            throw new BadCredentialsException("");

        if(!optionalUserAccount.get().getVerified())
            throw new UserAccountNotVerifiedException();

        return EmailPasswordAuthenticationToken.authenticated(
                optionalUserAccount.get(),
                userAccountLoginDTO,
                optionalUserAccount.get().getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return EmailPasswordAuthenticationToken.class.equals(authentication);
    }
}
