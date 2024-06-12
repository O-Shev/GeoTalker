package com.geotalker.core.util;

public final class ValidationConstants {
    public static final String INTERLINK_REGEX = "^((https?://)?(telegram\\.me|telegram\\.dog|t\\.me/))?(((\\+|joinchat/)([\\w-]+))|([a-zA-Z0-9_]{5,}))$";
    public static final String HTML_CHAT_PREVIEW_EXTRA_REGEX = "^(((\\d+(?: \\d{3})*)( subscribers| subscriber| members| member))|(@))";
    public static final int MINIMUM_MEMBER_COUNT = 5000;
}
