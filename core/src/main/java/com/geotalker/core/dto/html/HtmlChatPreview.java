package com.geotalker.core.dto.html;

public class HtmlChatPreview {
    public final String title;
    public final String extra;
    public final String description;
    public final String photoUrl;
    public final String action;


    public HtmlChatPreview(String photoUrl,
                           String title,
                           String extra,
                           String description,
                           String action) {
        this.photoUrl = photoUrl;
        this.title = title;
        this.extra = extra;
        this.description = description;
        this.action = action;
    }
}
