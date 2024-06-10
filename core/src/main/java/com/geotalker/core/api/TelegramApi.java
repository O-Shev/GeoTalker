package com.geotalker.core.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.geotalker.core.dto.telegram.TFunction.*;
import com.geotalker.core.dto.telegram.TObject.*;
import com.geotalker.core.util.TErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;


import static org.springframework.http.MediaType.APPLICATION_JSON;


@Component
public class TelegramApi {

    private final RestClient client;

    @Autowired
    public TelegramApi(@Value("${spring.api.telegram.url}") String apiUrl){
        client = RestClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    private <T> T responseHandler(Class<T> clazz, TObject tObject){
        if (clazz.isInstance(tObject)) {
            return clazz.cast(tObject);
        } else if (tObject instanceof TError) {
            throw new TErrorException((TError) tObject);
        } else {
            throw new RuntimeException("Dont expected Telegram response type: [response: " + tObject + "]");
        }
    }

    public TChatInviteLinkInfo checkChatInviteLink(TCheckChatInviteLink tFunction){
        TObject tObject =  client.post()
                .contentType(APPLICATION_JSON)
                .body(tFunction)
                .accept(APPLICATION_JSON)
                .retrieve()
                .body(TObject.class);

        return responseHandler(TChatInviteLinkInfo.class, tObject);
    }


    public TChat searchPublicChat(TSearchPublicChat tFunction){
        TObject tObject =  client.post()
                .contentType(APPLICATION_JSON)
                .body(tFunction)
                .accept(APPLICATION_JSON)
                .retrieve()
                .body(TObject.class);

        return responseHandler(TChat.class, tObject);
    }

    public TChat joinChatByInviteLink(TJoinChatByInviteLink tFunction){
        TObject tObject =  client.post()
                .contentType(APPLICATION_JSON)
                .body(tFunction)
                .accept(APPLICATION_JSON)
                .retrieve()
                .body(TObject.class);

        return responseHandler(TChat.class, tObject);
    }

    public TOk joinChat(TJoinChat tFunction){
        TObject tObject =  client.post()
                .contentType(APPLICATION_JSON)
                .body(tFunction)
                .accept(APPLICATION_JSON)
                .retrieve()
                .body(TObject.class);

        return responseHandler(TOk.class, tObject);
    }

    public TChat getChat(TGetChat tFunction){
        TObject tObject =  client.post()
                .contentType(APPLICATION_JSON)
                .body(tFunction)
                .accept(APPLICATION_JSON)
                .retrieve()
                .body(TObject.class);

        return responseHandler(TChat.class, tObject);
    }

}


//   if (method === 'GET' && path === '/t/checkChatInviteLink') {
//           this.#t_client.eventEmitter.once(this.#requestId, (response) => {
//           res.end(JSON.stringify(response));
//           });
//
//           this.#t_client.tdSend({
//           '@type': 'checkChatInviteLink',
//           '@extra': this.#requestId,
//           'invite_link': decodeURIComponent(queryParams.invite_link)
//           })
//           }
//           else if (method === 'GET' && path === '/t/searchPublicChat') {
//           this.#t_client.eventEmitter.once(this.#requestId, (response) => {
//           res.end(JSON.stringify(response));
//           });
//
//           this.#t_client.tdSend({
//           '@type': 'searchPublicChat',
//           '@extra': this.#requestId,
//           'username': queryParams.username
//           })
//           }
//           else if (method === 'GET' && path === '/t/getSupergroupFullInfo') {
//           this.#t_client.eventEmitter.once(this.#requestId, (response) => {
//           res.end(JSON.stringify(response));
//           });
//
//           this.#t_client.tdSend({
//           '@type': 'getSupergroupFullInfo',
//           '@extra': this.#requestId,
//           'supergroup_id': queryParams.supergroup_id
//           })
//           }
//           else if (method === 'GET' && path === '/t/joinChatByInviteLink') {
//           this.#t_client.eventEmitter.once(this.#requestId, (response) => {
//           res.end(JSON.stringify(response));
//           });
//
//           this.#t_client.tdSend({
//           '@type': 'joinChatByInviteLink',
//           '@extra': this.#requestId,
//           'invite_link': decodeURIComponent(queryParams.invite_link)
//           })
//           }
//           else if (method === 'GET' && path === '/t/joinChat') {
//           this.#t_client.eventEmitter.once(this.#requestId, (response) => {
//           res.end(JSON.stringify(response));
//           });
//
//           this.#t_client.tdSend({
//           '@type': 'joinChat',
//           '@extra': this.#requestId,
//           'chat_id': decodeURIComponent(queryParams.chat_id)
//           })
//           }