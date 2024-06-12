package com.nominationsystem.tracers.service;

import java.util.Collection;
import java.util.Collections;

import java.util.Objects;

import com.nominationsystem.tracers.models.Employee;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class UserDetailsImpl implements UserDetails {

    private static final long serialVersionUID = 1L;

    private String id;
    private String username;

    private String email;

    private String empId;

    private String managerId;

    private String empName;

    private String band;

    @JsonIgnore
    private String password;

    @DBRef
    private String role;

    public UserDetailsImpl(String id, String username, String email, String password, String role, String empId, String managerId, String empName, String band) {
        super();
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.empId = empId;
        this.managerId = managerId;
        this.empName = empName;
        this.band=band;
    }

    public static UserDetailsImpl build(Employee users) {

        return new UserDetailsImpl(
                users.getId(),
                users.getUsername(),
                users.getEmail(),
                users.getPassword(),
                users.getRole(),
                users.getEmpId(),
                users.getManagerId(),
                users.getEmpName(),
                users.getBand());
    }

    @Override
    public String toString() {
        return "UserDetailsImpl [id=" + id + ", username=" + username + ", email=" + email + ", password=" + password
                + ", role=" + role + "]";
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(role));
    }

    public String getId() {
        return id;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public String getBand() {
        return band;
    }

    public String getEmail() {
        return email;
    }

    public String getEmpId() {
        return empId;
    }

    public String getManagerId() {
        return managerId;
    }

    public String getEmpName() {
        return empName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }

}
