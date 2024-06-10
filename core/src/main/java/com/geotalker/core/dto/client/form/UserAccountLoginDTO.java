package com.geotalker.core.dto.client.form;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserAccountLoginDTO(

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Password is required")
        String password
){}
