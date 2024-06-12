package com.geotalker.core.dto.telegram.TObject;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TLocalFile extends TObject {

    public final String path;
    public final Boolean canBeDownloaded;
    public final Boolean canBeDeleted;
    public final Boolean isDownloadingActive;
    public final Boolean isDownloadingCompleted;
    public final Integer downloadOffset;
    public final Integer downloadedPrefixSize;
    public final Integer downloadedSize;

    @JsonCreator
    public TLocalFile(@JsonProperty("path") String path,
                      @JsonProperty("can_be_downloaded") Boolean canBeDownloaded,
                      @JsonProperty("can_be_deleted") Boolean canBeDeleted,
                      @JsonProperty("is_downloading_active") Boolean isDownloadingActive,
                      @JsonProperty("is_downloading_completed") Boolean isDownloadingCompleted,
                      @JsonProperty("download_offset") Integer downloadOffset,
                      @JsonProperty("downloaded_prefix_size") Integer downloadedPrefixSize,
                      @JsonProperty("downloaded_size") Integer downloadedSize) {
        this.path = path;
        this.canBeDownloaded = canBeDownloaded;
        this.canBeDeleted = canBeDeleted;
        this.isDownloadingActive = isDownloadingActive;
        this.isDownloadingCompleted = isDownloadingCompleted;
        this.downloadOffset = downloadOffset;
        this.downloadedPrefixSize = downloadedPrefixSize;
        this.downloadedSize = downloadedSize;
    }

    @Override
    public String toString() {
        return "TLocalFile{" +
                "path='" + path + '\'' +
                ", canBeDownloaded=" + canBeDownloaded +
                ", canBeDeleted=" + canBeDeleted +
                ", isDownloadingActive=" + isDownloadingActive +
                ", isDownloadingCompleted=" + isDownloadingCompleted +
                ", downloadOffset=" + downloadOffset +
                ", downloadedPrefixSize=" + downloadedPrefixSize +
                ", downloadedSize=" + downloadedSize +
                '}';
    }
}

