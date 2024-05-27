package com.nominationsystem.tracers.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class UserDetailsImplTest {

    @Test
    public void testGetAuthorities() {
        // Given
        String role = "ROLE_USER";
        UserDetailsImpl userDetails = new UserDetailsImpl("1", "testuser", "test@example.com", "password", role,
                "empId", "managerId", "empName");

        // When
        var authorities = userDetails.getAuthorities();

        // Then
        assertEquals(1, authorities.size());
        assertTrue(authorities.contains(new SimpleGrantedAuthority(role)));
    }

    @Test
    public void testEquals() {
        // Given
        UserDetailsImpl userDetails1 = new UserDetailsImpl("1", "testuser", "test@example.com", "password", "ROLE_USER",
                "empId", "managerId", "empName");
        UserDetailsImpl userDetails2 = new UserDetailsImpl("1", "testuser", "test@example.com", "password", "ROLE_USER",
                "empId", "managerId", "empName");
        UserDetailsImpl userDetails3 = new UserDetailsImpl("2", "testuser", "test@example.com", "password", "ROLE_USER",
                "empId", "managerId", "empName");

        // Then
        assertTrue(userDetails1.equals(userDetails2));
        assertTrue(!userDetails1.equals(userDetails3));
    }
}
