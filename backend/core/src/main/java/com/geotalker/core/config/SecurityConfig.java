package com.geotalker.core.config;


import com.geotalker.core.security.OAuth2AuthenticationProvider;
import com.geotalker.core.security.EmailPasswordAuthenticationProvider;
import com.geotalker.core.service.UserAccountService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.oauth2.client.CommonOAuth2Provider;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.DelegatingSecurityContextRepository;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.RequestAttributeSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

//    @Value("${spring.security.cors.allowed-origins}")
//    private String allowedOrigins;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
//                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/client/user-account/getMe").authenticated()
                        .requestMatchers("/client/postGeoChat").hasAnyAuthority("USER", "ADMIN")
                        .anyRequest().permitAll()
                )
                .logout((logout)-> logout
                        .logoutUrl("/client/user-account/logout")
                )
                .formLogin(AbstractHttpConfigurer::disable) // Disable form-based login
                .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }

//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
//        configuration.setAllowedMethods(Arrays.asList("GET","POST","OPTIONS"));
//        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
//        configuration.setExposedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
//        configuration.setAllowCredentials(true);
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/client/**", configuration);
//        return source;
//    }


    @Bean
    public AuthenticationManager authenticationManager(UserAccountService userAccountService,
                                                       PasswordEncoder passwordEncoder,
                                                       ClientRegistrationRepository clientRegistrationRepository) {
        return new ProviderManager(List.of(
                new EmailPasswordAuthenticationProvider(userAccountService, passwordEncoder),
                new OAuth2AuthenticationProvider(userAccountService, clientRegistrationRepository)
        ));
    }

    @Bean
    public PasswordEncoder getPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityContextRepository getSecurityContextRepository(){
        return new DelegatingSecurityContextRepository(
                new RequestAttributeSecurityContextRepository(),
                new HttpSessionSecurityContextRepository()
        );
    }


    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        return new InMemoryClientRegistrationRepository(List.of(
                CommonOAuth2Provider.GOOGLE.getBuilder("GOOGLE")
                        .clientId(googleClientId)
                        .clientSecret(googleClientSecret)
                        .redirectUri("https://geotalker.com")
                        .build()
        ));
    }

}
