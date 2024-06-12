package com.geotalker.core.dto.telegram.TObject.TChatType;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TChatTypePrivate extends TChatType{

    public final Long userId;

    @JsonCreator
    public TChatTypePrivate(@JsonProperty("user_id") Long userId) {

        this.userId = userId;
    }

    @Override
    public String toString() {
        return "TChatTypePrivate{" +
                "userId=" + userId +
                '}';
    }
}
