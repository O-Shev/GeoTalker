package com.geotalker.core.util;

import org.springframework.security.core.AuthenticationException;

public class UserAccountNotVerifiedException extends AuthenticationException {
    public UserAccountNotVerifiedException(){
        super("");
    }
    public UserAccountNotVerifiedException(String msg) {
        super(msg);
    }
}
