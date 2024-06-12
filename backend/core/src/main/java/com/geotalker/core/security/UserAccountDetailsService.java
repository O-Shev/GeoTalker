package com.geotalker.core.security;

import com.geotalker.core.model.UserAccount;
import com.geotalker.core.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserAccountDetailsService {

    private final UserAccountService userAccountService;

    @Autowired
    public UserAccountDetailsService(UserAccountService userAccountService) {
        this.userAccountService = userAccountService;
    }

    public Optional<UserAccountDetails> loadUserAccountByEmail(String email) throws UsernameNotFoundException {
        Optional<UserAccount> optionalUserAccount = userAccountService.loadUserAccountByEmail(email);
        return optionalUserAccount.map(UserAccountDetails::new);
    }

}
