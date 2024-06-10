package com.geotalker.core.service;

import com.geotalker.core.dto.client.form.UserAccountRegisterDTO;
import com.geotalker.core.model.ConfirmationToken;
import com.geotalker.core.model.UserAccount;
import com.geotalker.core.repository.ConfirmationTokenRepository;
import com.geotalker.core.repository.UserAccountRepository;
import com.geotalker.core.util.ConfirmationTokenInvalidException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserAccountService {
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final ConfirmationTokenRepository confirmationTokenRepository;
    private final String hostUrl;

    @Autowired
    public UserAccountService(UserAccountRepository userAccountRepository,
                              ConfirmationTokenRepository confirmationTokenRepository,
                              PasswordEncoder passwordEncoder,
                              EmailService emailService,
                              @Value("${spring.host-url}") String hostUrl) {

        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.confirmationTokenRepository = confirmationTokenRepository;
        this.hostUrl = hostUrl;
    }

    public boolean isEmailAlreadyExists(String email) {
        Optional<UserAccount> optionalUserAccount =  userAccountRepository.findByEmail(email);
        return optionalUserAccount.isPresent();
    }
    public Optional<UserAccount> loadUserAccountByEmail(String email) {
        return userAccountRepository.findByEmail(email);
    }

    public void localRegistrationUserAccount(UserAccountRegisterDTO userSignInDTO) {

        UserAccount userAccount = UserAccount.builder()
                .email(userSignInDTO.email())
                .password(passwordEncoder.encode(userSignInDTO.password()))
                .provider(UserAccount.Provider.LOCAL)
                .role(UserAccount.UserRole.USER)
                .verified(false)
                .build();


        userAccount = userAccountRepository.save(userAccount);

        createConfirmationTokenAndSendEmail(userAccount);
    }

    public void createConfirmationTokenAndSendEmail(UserAccount userAccount){

        ConfirmationToken confirmationToken = ConfirmationToken.builder()
                .value(ConfirmationToken.generateConfirmationTokenValue())
                .userAccount(userAccount)
                .build();

        confirmationTokenRepository.save(confirmationToken);


        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(userAccount.getEmail());
        mailMessage.setSubject("Complete Registration!");
        mailMessage.setText(getEmailVerificationText(confirmationToken));

        emailService.sendEmail(mailMessage);
    }

    public void confirmUserAccount(String confirmationTokenValue) throws ConfirmationTokenInvalidException {
       Optional<ConfirmationToken> optionalConfirmationToken = confirmationTokenRepository.findConfirmationTokenByValue(confirmationTokenValue);

       if(optionalConfirmationToken.isPresent()){
           UserAccount userAccount = optionalConfirmationToken.get().getUserAccount();
           userAccount.setVerified(true);
           userAccountRepository.save(userAccount);
           confirmationTokenRepository.delete(optionalConfirmationToken.get());
       } else throw new ConfirmationTokenInvalidException();
    }

    public UserAccount processOAuth2User(OAuth2User oAuth2User, ClientRegistration clientRegistration) {
        Optional<UserAccount> optionalUserAccount = userAccountRepository.findByEmail(oAuth2User.getAttribute("email"));

        // TODO check on clientRegistration
        UserAccount userAccount;
        if(optionalUserAccount.isPresent()){
            userAccount = optionalUserAccount.get();
            userAccount.setProfilePhoto(oAuth2User.getAttribute("picture"));
            userAccount.setVerified(true);
            if(userAccount.getName() == null) userAccount.setName(oAuth2User.getAttribute("name"));
            if(userAccount.getProfilePhoto() == null) userAccount.setName(oAuth2User.getAttribute("picture"));

        } else {
            userAccount = UserAccount.builder()
                    .name(oAuth2User.getAttribute("name"))
                    .email(oAuth2User.getAttribute("email"))
                    .verified(true)
                    .profilePhoto(oAuth2User.getAttribute("picture"))
                    .role(UserAccount.UserRole.USER)
                    .provider(UserAccount.Provider.GOOGLE)
                    .build();
        }
        userAccountRepository.save(userAccount);
        return userAccount;
    }


    private String getEmailVerificationText(ConfirmationToken confirmationToken){
        return "Hello,\n" +
                "\n" +
                "Somebody just used this email address to sign up at GeoTalker.\n" +
                "\n" +
                "If this was you, verify your email by clicking on the link below:\n" +
                hostUrl +"/confirm-account?token="+confirmationToken.getValue();
    }

}
