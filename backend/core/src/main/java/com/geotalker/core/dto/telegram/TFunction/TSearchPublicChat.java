package com.geotalker.core.dto.telegram.TFunction;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TSearchPublicChat extends TFunction{
    public final String username;

    public TSearchPublicChat(@JsonProperty("username") String username) {
        this.username = username;
    }
}
