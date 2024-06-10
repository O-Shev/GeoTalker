package com.geotalker.core.dto.telegram.TObject;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TFile extends TObject {

    public final Integer id;
    public final Integer size;
    public final Integer expectedSize;
    public final TLocalFile local;
    public final TRemoteFile remote;

    @JsonCreator
    public TFile(@JsonProperty("id") Integer id,
                 @JsonProperty("size") Integer size,
                 @JsonProperty("expected_size") Integer expectedSize,
                 @JsonProperty("local") TLocalFile local,
                 @JsonProperty("remote") TRemoteFile remote) {
        this.id = id;
        this.size = size;
        this.expectedSize = expectedSize;
        this.local = local;
        this.remote = remote;
    }

    @Override
    public String toString() {
        return "TFile{" +
                "id=" + id +
                ", size=" + size +
                ", expectedSize=" + expectedSize +
                ", local=" + local +
                ", remote=" + remote +
                '}';
    }
}

