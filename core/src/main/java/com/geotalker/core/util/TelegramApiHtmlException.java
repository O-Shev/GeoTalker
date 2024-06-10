package com.geotalker.core.util;

import org.springframework.web.client.RestClientException;

public class TelegramApiHtmlException extends Exception{

    public TelegramApiHtmlException(String message, RestClientException cause) {
        super(message, cause);
    }
    public TelegramApiHtmlException(String message, NumberFormatException cause) {
        super(message, cause);
    }

}
