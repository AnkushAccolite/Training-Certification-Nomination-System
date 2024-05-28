package com.nominationsystem.tracers.payload.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;

    @JsonIgnore
    private String type = "Bearer";

    @JsonIgnore
    private String id;

    @JsonIgnore
    private String email;

    @JsonIgnore
    private String username;

    @JsonIgnore
    private List<String> roles;

    @JsonIgnore
    private String empName;

    @JsonIgnore
    private String empId;

    @JsonIgnore
    private String managerId;

    public JwtResponse(String token) {
        this.token = token;
    }

    public JwtResponse(String token, List<String> roles) {
        this.token = token;
    }

}
