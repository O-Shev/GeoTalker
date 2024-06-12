package com.geotalker.core.controller;

import com.geotalker.core.dto.client.UserAccountDTO;
import com.geotalker.core.dto.client.form.UserAccountLoginDTO;
import com.geotalker.core.dto.client.form.UserAccountOAuth2DTO;
import com.geotalker.core.dto.client.form.UserAccountRegisterDTO;
import com.geotalker.core.model.UserAccount;
import com.geotalker.core.security.OAuth2AuthenticationToken;
import com.geotalker.core.security.EmailPasswordAuthenticationToken;
import com.geotalker.core.service.UserAccountService;
import com.geotalker.core.util.ConfirmationTokenInvalidException;
import com.geotalker.core.util.UserAccountMapper;
import com.geotalker.core.util.UserAccountNotVerifiedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/client/user-account")
public class UserAccountController {

    private final UserAccountMapper userAccountMapper;
    private final UserAccountService userAccountService;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final SecurityContextHolderStrategy securityContextHolderStrategy = SecurityContextHolder.getContextHolderStrategy();


    @Autowired
    public UserAccountController(UserAccountMapper userAccountMapper,
                                 UserAccountService userAccountService,
                                 AuthenticationManager authenticationManager,
                                 SecurityContextRepository securityContextRepository) {
        this.userAccountMapper = userAccountMapper;
        this.userAccountService = userAccountService;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
    }

    @GetMapping("/getMe")
    public ResponseEntity<UserAccountDTO> getMe(Authentication authentication){
        UserAccount userAccount = (UserAccount) authentication.getPrincipal();

        return ResponseEntity.ok().body(userAccountMapper.toDto(userAccount));
    }

    @PostMapping("/authorize/register")
    public ResponseEntity<?> registerUserAccount(@RequestBody @Valid UserAccountRegisterDTO userAccountRegisterDTO){

        if(userAccountService.isEmailAlreadyExists(userAccountRegisterDTO.email()))
            return ResponseEntity.status(HttpStatus.CONFLICT).build();

        userAccountService.localRegistrationUserAccount(userAccountRegisterDTO);

        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    @RequestMapping(value="/authorize/confirm-account", method={RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<?> confirmUserAccount(@RequestParam("token") String confirmationTokenValue){
        try {
            userAccountService.confirmUserAccount(confirmationTokenValue);
            return ResponseEntity.ok().body("your account approved!");
        } catch (ConfirmationTokenInvalidException e) {
            return ResponseEntity.badRequest().body("confirmation code is invalid!");
        }
    }

    @PostMapping("/authorize/login")
    public ResponseEntity<?> loginUserAccount(@RequestBody @Valid UserAccountLoginDTO userAccountLoginDTO,
                                                   HttpServletRequest request,
                                                   HttpServletResponse response){

        try {
            Authentication authentication =
                    authenticationManager.authenticate(EmailPasswordAuthenticationToken.unauthenticated(userAccountLoginDTO));

            SecurityContext context = securityContextHolderStrategy.createEmptyContext();
            context.setAuthentication(authentication);
            securityContextHolderStrategy.setContext(context);
            securityContextRepository.saveContext(context, request, response);

            return ResponseEntity.ok("ok");
        } catch (UserAccountNotVerifiedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("account not verified, please check your email");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("wrong email or password");
        }
    }

    @PostMapping("/authorize/oauth2")
    public ResponseEntity<?> googleLoginSuccess(@RequestBody @Valid UserAccountOAuth2DTO userAccountOAuth2DTO,
                                                HttpServletRequest request,
                                                HttpServletResponse response) {

        try{
            Authentication authentication = authenticationManager.authenticate(OAuth2AuthenticationToken.unauthenticated(userAccountOAuth2DTO));

            SecurityContext context = securityContextHolderStrategy.createEmptyContext();
            context.setAuthentication(authentication);
            securityContextHolderStrategy.setContext(context);
            securityContextRepository.saveContext(context, request, response);

            return ResponseEntity.ok("ok");
        }  catch (AuthenticationException e) {
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }




}
