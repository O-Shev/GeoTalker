package com.geotalker.core.model;


import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.geotalker.core.util.ValidationConstants.INTERLINK_REGEX;


public class Interlink {
    private final Boolean isHash;
    private final String value;

    private static final Pattern interlinkPattern = Pattern.compile(INTERLINK_REGEX);
    private static final String interlinkDomain = "https://t.me/";



    public Interlink(String str){
        Matcher matcher = interlinkPattern.matcher(str);
        if (matcher.matches()) {
            if (matcher.group(7) != null ){
                this.isHash = true;
                this.value=matcher.group(7);
            } else if (matcher.group(8) != null) {
                this.isHash = false;
                this.value=matcher.group(8);
            } else throw new RuntimeException("Error: matcher.group(*) not 7 and not 8. cause by [InterlinkHandler::getUrlFromInterlink]");
        } else {
            throw new RuntimeException("Error matching interlink");
        }
    }

    public String getAsUrl(){
        if(this.isHash) return interlinkDomain + "+" + this.value;
        else return interlinkDomain + this.value;
    }
    public static boolean check(String interlink){
        Matcher matcher = interlinkPattern.matcher(interlink);
        return matcher.matches();
    }

    public Boolean isHash() {
        return isHash;
    }

    public Boolean isUsername() {
        return !isHash;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return "Interlink{" +
                "isHash=" + isHash +
                ", value='" + value + '\'' +
                '}';
    }
}
