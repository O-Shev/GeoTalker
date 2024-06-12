package com.geotalker.core.dto.client.form;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;

@JsonIgnoreProperties(ignoreUnknown = true)
public record UserAccountOAuth2DTO (
        @NotBlank(message = "oauth2 code is required")
        String code,
        @NotBlank(message = "registrationId is required")
        String registrationId
){}
