package com.geotalker.core.dto.telegram.TObject;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Arrays;

public class TMiniThumbnail extends TObject {

    public final Integer width;
    public final Integer height;
    public final byte[] data;

    @JsonCreator
    public TMiniThumbnail(@JsonProperty("width") Integer width,
                          @JsonProperty("height") Integer height,
                          @JsonProperty("data") byte[] data) {
        this.width = width;
        this.height = height;
        this.data = data;
    }

    @Override
    public String toString() {
        return "TMiniThumbnail{" +
                "width=" + width +
                ", height=" + height +
                ", data=" + Arrays.toString(data) +
                '}';
    }
}
