package com.geotalker.core.dto.telegram.TObject.TChatType;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TChatTypeSupergroup extends TChatType{

    public final Long supergroupId;
    public final Boolean isChannel;

    @JsonCreator
    public TChatTypeSupergroup(@JsonProperty("supergroup_id") Long supergroupId,
                               @JsonProperty("is_channel") Boolean isChannel) {
        this.supergroupId = supergroupId;
        this.isChannel = isChannel;
    }

    @Override
    public String toString() {
        return "TChatTypeSupergroup{" +
                "supergroupId=" + supergroupId +
                ", isChannel=" + isChannel +
                '}';
    }
}
