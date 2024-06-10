package com.geotalker.core.dto.telegram.TObject;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TChatPhotoInfo extends TObject {

    public final TFile small;
    public final TFile big;
    public final TMiniThumbnail miniThumbnail;
    public final Boolean hasAnimation;

    @JsonCreator
    public TChatPhotoInfo(@JsonProperty("small") TFile small,
                          @JsonProperty("big") TFile big,
                          @JsonProperty("minithumbnail") TMiniThumbnail miniThumbnail,
                          @JsonProperty("has_animation") Boolean hasAnimation) {
        this.small = small;
        this.big = big;
        this.miniThumbnail = miniThumbnail;
        this.hasAnimation = hasAnimation;
    }

    @Override
    public String toString() {
        return "TChatPhotoInfo{" +
                "small=" + small +
                ", big=" + big +
                ", miniThumbnail=" + miniThumbnail +
                ", hasAnimation=" + hasAnimation +
                '}';
    }
}
