package com.geotalker.core.dto.telegram.TObject;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TError extends TObject {

    public final Integer code;
    public final String message;

    @JsonCreator
    public TError(@JsonProperty("code") Integer code,
                  @JsonProperty("message") String message) {
        this.code = code;
        this.message = message;
    }

    @Override
    public String toString() {
        return "TError{" +
                "code=" + code +
                ", error='" + message + '\'' +
                '}';
    }
}

