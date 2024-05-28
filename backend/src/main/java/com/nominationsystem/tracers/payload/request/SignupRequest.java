package com.nominationsystem.tracers.payload.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {

    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    private String role;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    public void setUsername(String username) {

        this.username = username;
        this.email = username;
    }

    public void setEmail(String mail) {
    }

}
