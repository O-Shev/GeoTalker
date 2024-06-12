package com.geotalker.core.dto.telegram.TObject;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TRemoteFile extends TObject {

    public final String id;
    public final String uniqueId;
    public final Boolean isUploadingActive;
    public final Boolean isUploadingCompleted;
    public final Integer uploadedSize;

    @JsonCreator
    public TRemoteFile(@JsonProperty("id") String id,
                       @JsonProperty("unique_id") String uniqueId,
                       @JsonProperty("is_uploading_active") Boolean isUploadingActive,
                       @JsonProperty("is_uploading_completed") Boolean isUploadingCompleted,
                       @JsonProperty("uploaded_size") Integer uploadedSize) {
        this.id = id;
        this.uniqueId = uniqueId;
        this.isUploadingActive = isUploadingActive;
        this.isUploadingCompleted = isUploadingCompleted;
        this.uploadedSize = uploadedSize;
    }

    @Override
    public String toString() {
        return "TRemoteFile{" +
                "id='" + id + '\'' +
                ", uniqueId='" + uniqueId + '\'' +
                ", isUploadingActive=" + isUploadingActive +
                ", isUploadingCompleted=" + isUploadingCompleted +
                ", uploadedSize=" + uploadedSize +
                '}';
    }
}
