package com.geotalker.core.dto.telegram.TObject.TChatType;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TChatTypeBasicGroup extends TChatType{

    public final Long basicGroupId_;

    @JsonCreator
    public TChatTypeBasicGroup(@JsonProperty("basic_group_id")Long basicGroupId) {
        basicGroupId_ = basicGroupId;
    }

    @Override
    public String toString() {
        return "TChatTypeBasicGroup{" +
                "basicGroupId_=" + basicGroupId_ +
                '}';
    }
}
