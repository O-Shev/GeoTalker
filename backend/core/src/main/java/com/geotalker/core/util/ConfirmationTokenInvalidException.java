package com.geotalker.core.util;

import java.io.IOException;

public class ConfirmationTokenInvalidException extends IOException {
    public ConfirmationTokenInvalidException(){}

    public ConfirmationTokenInvalidException(String message) {
        super(message);
    }
}
