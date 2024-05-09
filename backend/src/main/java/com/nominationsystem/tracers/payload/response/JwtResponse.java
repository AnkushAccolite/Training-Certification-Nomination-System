package com.nominationsystem.tracers.payload.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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



    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }


    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }
    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public JwtResponse(String token) {
        this.token = token;
    }

    public JwtResponse(String token, String type, String id, String username, String email, List<String> roles) {
        this.token = token;
        this.type = type;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }

    public JwtResponse(String token, List<String> roles) {
        this.token = token;
    }

    public JwtResponse() {
        super();
    }


}
