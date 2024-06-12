package com.geotalker.core.api;

import com.geotalker.core.dto.html.HtmlChatPreview;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class HtmlApi {

    private final RestClient client;

    public HtmlApi(){
        client = RestClient.create();
    }

    public HtmlChatPreview getTelegramPreview(String tMeUrl)  {
        String htmlBody = client.get()
                .uri(tMeUrl)
                .retrieve()
                .body(String.class);

        Document d = Jsoup.parse(htmlBody);
        String photoUrl = d.select("img.tgme_page_photo_image").first() != null ? d.select("img.tgme_page_photo_image").first().attr("src") : null;
        String title = d.select(".tgme_page_title").first() != null ? d.select(".tgme_page_title").first().text() : null;
        String extra = d.select(".tgme_page_extra").first() != null ? d.select(".tgme_page_extra").first().text() : null;
        String description = d.select(".tgme_page_description").first() != null ? d.select(".tgme_page_description").first().text() : null;
        String action = d.select(".tgme_page_action").first() != null ? d.select(".tgme_page_action").first().text() : null;
        return new HtmlChatPreview(photoUrl, title, extra, description, action);
    }
}