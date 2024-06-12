package com.geotalker.core.util;

import org.springframework.stereotype.Component;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class HtmlChatPreviewHandler {
    private static final Pattern TELEGRAM_EXTRA_PATTERN = Pattern.compile(ValidationConstants.HTML_CHAT_PREVIEW_EXTRA_REGEX);

    public enum chatType{
        CHANNEL,
        GROUP,
        USER
    }

    public int extractMembersCount(String extra){
        try{
            Matcher matcher = TELEGRAM_EXTRA_PATTERN.matcher(extra);
            if(matcher.find()) {
                String countString = matcher.group(3).replaceAll(" ", "");
                return Integer.parseInt(countString);
            } else throw new Exception();
        } catch (Exception e){
            throw new RuntimeException("can't parse extract. cause [HtmlChatPreviewHandler::extractMembersCount]");
        }
    }

    public String extractChatType(String extra){
        try{
            Matcher matcher = TELEGRAM_EXTRA_PATTERN.matcher(extra);
            if(matcher.find()) {
                if(matcher.group(5) != null) return "USER";
                if(matcher.group(4).equals(" subscribers") || matcher.group(4).equals(" subscriber")) return "CHANNEL";
                else if(matcher.group(4).equals(" members") || matcher.group(4).equals(" member")) return "GROUP";
                else throw new Exception();
            } else throw new Exception();
        } catch (Exception e){
            throw new RuntimeException("can't parse extract. cause [HtmlChatPreviewHandler::extractMembersCount]");
        }
    }
}
