package com.geotalker.core.dto.client;

public record InterlinkPreview(Preview preview,
                               Boolean isValid,
                               String error) {

    public record Preview(String title,
                          String extra,
                          String description,
                          String photoUrl){}

}
