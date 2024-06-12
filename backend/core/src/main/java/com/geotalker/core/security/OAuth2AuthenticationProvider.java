package com.geotalker.core.security;

import com.geotalker.core.model.UserAccount;
import com.geotalker.core.service.UserAccountService;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.http.OAuth2ErrorResponseErrorHandler;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthorizationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.endpoint.DefaultMapOAuth2AccessTokenResponseConverter;
import org.springframework.security.oauth2.core.endpoint.OAuth2AccessTokenResponse;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON;

public class OAuth2AuthenticationProvider implements AuthenticationProvider {
    private final UserAccountService userAccountService;
    private final ClientRegistrationRepository clientRegistrationRepository;
    private final RestClient restClient;
    private final DefaultMapOAuth2AccessTokenResponseConverter accessTokenResponseConverter;
    private final DefaultOAuth2UserService defaultOAuth2UserService;

    public OAuth2AuthenticationProvider(UserAccountService userAccountService, ClientRegistrationRepository clientRegistrationRepository) {
        this.userAccountService = userAccountService;
        this.clientRegistrationRepository = clientRegistrationRepository;
        restClient = RestClient.create();
        accessTokenResponseConverter = new DefaultMapOAuth2AccessTokenResponseConverter();
        defaultOAuth2UserService = new DefaultOAuth2UserService();
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        ClientRegistration clientRegistration = this.clientRegistrationRepository.findByRegistrationId(token.getCredentials().registrationId());

        OAuth2AccessTokenResponse oAuth2AccessTokenResponse = exchangeAuthorizationCodeForAccessToken(clientRegistration, token.getCredentials().code());
        OAuth2AccessToken oAuth2AccessToken = new OAuth2AccessToken(oAuth2AccessTokenResponse.getAccessToken().getTokenType(), oAuth2AccessTokenResponse.getAccessToken().getTokenValue(), null, null);
        OAuth2User oAuth2User = defaultOAuth2UserService.loadUser(new OAuth2UserRequest(clientRegistration, oAuth2AccessToken));

        UserAccount userAccount = userAccountService.processOAuth2User(oAuth2User, clientRegistration);

        return OAuth2AuthenticationToken.authenticated(userAccount, token.getCredentials(), userAccount.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return OAuth2AuthenticationToken.class.equals(authentication);
    }


    private OAuth2AccessTokenResponse exchangeAuthorizationCodeForAccessToken(ClientRegistration clientRegistration, String authorizationCode) {

        Map<String, String> uriVariables = new HashMap<>();
        uriVariables.put("code", authorizationCode);
        uriVariables.put("client_id", clientRegistration.getClientId());
        uriVariables.put("client_secret", clientRegistration.getClientSecret());
        uriVariables.put("redirect_uri", clientRegistration.getRedirectUri());
        uriVariables.put("grant_type", clientRegistration.getAuthorizationGrantType().getValue());

        return restClient.post()
                .uri(clientRegistration.getProviderDetails().getTokenUri()+"?code={code}&client_id={client_id}&client_secret={client_secret}&redirect_uri={redirect_uri}&grant_type={grant_type}", uriVariables)
                .body("")
                .accept(APPLICATION_JSON)
                .exchange((request, response)-> {
                    if (response.getStatusCode().isError()) {
                        throw new OAuth2AuthenticationException(response.toString());
                    }
                    Map<String, Object> v = response.bodyTo(new ParameterizedTypeReference<>() {});
                    if(v == null) throw new OAuth2AuthenticationException("response body is null");
                    return accessTokenResponseConverter.convert(v);
                });
    }

}

//        .uri(uriBuilder -> uriBuilder.path(clientRegistration.getProviderDetails().getTokenUri())
//                .queryParam("code", authorizationCode)
//                .queryParam("client_id", clientRegistration.getClientId())
//                .queryParam("client_secret", clientRegistration.getClientSecret())
//                .queryParam("redirect_uri", clientRegistration.getRedirectUri())
//                .queryParam("grant_type", clientRegistration.getAuthorizationGrantType().getValue())
//                .build())
//clientRegistration.getProviderDetails().getTokenUri()+"?code={code}&client_id={client_id}&client_secret={client_secret}&redirect_uri={redirect_uri}&grant_type={grant_type}", uriVariables
//        System.out.println(oAuth2AccessTokenResponse.getAccessToken().getTokenValue());
//        System.out.println(oAuth2AccessTokenResponse.getRefreshToken().getTokenValue());
//
//        for (Map.Entry<String, Object> entry : oAuth2AccessTokenResponse.getAdditionalParameters().entrySet()) {
//            String key = entry.getKey();
//            Object value = entry.getValue();
//            System.out.println("Key: " + key + ", Value: " + value);
//        }
