package com.nominationsystem.tracers.payload.response;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

public class JwtResponseTest {

    @Test
    public void testDefaultConstructor() {
        JwtResponse jwtResponse = new JwtResponse();
        assertNull(jwtResponse.getToken());
        assertEquals("Bearer", jwtResponse.getType());
        assertNull(jwtResponse.getId());
        assertNull(jwtResponse.getUsername());
        assertNull(jwtResponse.getEmail());
        assertNull(jwtResponse.getRoles());
        assertNull(jwtResponse.getEmpId());
        assertNull(jwtResponse.getManagerId());
        assertNull(jwtResponse.getEmpName());
    }

    @Test
    public void testConstructorWithToken() {
        JwtResponse jwtResponse = new JwtResponse("token123");
        assertEquals("token123", jwtResponse.getToken());
        assertEquals("Bearer", jwtResponse.getType());
    }

    @Test
    public void testConstructorWithAllFields() {
        List<String> roles = Arrays.asList("ROLE_USER", "ROLE_ADMIN");
        JwtResponse jwtResponse = new JwtResponse("token123", "Bearer", "1", "user", "user@example.com", roles, "emp123", "mgr456", "John Doe");

        assertEquals("token123", jwtResponse.getToken());
        assertEquals("Bearer", jwtResponse.getType());
        assertEquals("1", jwtResponse.getId());
        assertEquals("user", jwtResponse.getUsername());
        assertEquals("user@example.com", jwtResponse.getEmail());
        assertEquals(roles, jwtResponse.getRoles());
        assertEquals("emp123", jwtResponse.getEmpId());
        assertEquals("mgr456", jwtResponse.getManagerId());
        assertEquals("John Doe", jwtResponse.getEmpName());
    }

    @Test
    public void testSettersAndGetters() {
        JwtResponse jwtResponse = new JwtResponse();
        List<String> roles = Arrays.asList("ROLE_USER", "ROLE_ADMIN");

        jwtResponse.setToken("token123");
        jwtResponse.setType("Bearer");
        jwtResponse.setId("1");
        jwtResponse.setUsername("user");
        jwtResponse.setEmail("user@example.com");
        jwtResponse.setRoles(roles);
        jwtResponse.setEmpId("emp123");
        jwtResponse.setManagerId("mgr456");
        jwtResponse.setEmpName("John Doe");

        assertEquals("token123", jwtResponse.getToken());
        assertEquals("Bearer", jwtResponse.getType());
        assertEquals("1", jwtResponse.getId());
        assertEquals("user", jwtResponse.getUsername());
        assertEquals("user@example.com", jwtResponse.getEmail());
        assertEquals(roles, jwtResponse.getRoles());
        assertEquals("emp123", jwtResponse.getEmpId());
        assertEquals("mgr456", jwtResponse.getManagerId());
        assertEquals("John Doe", jwtResponse.getEmpName());
    }

    @Test
    public void testConstructorWithTokenAndRoles() {
        List<String> roles = Arrays.asList("ROLE_USER", "ROLE_ADMIN");
        JwtResponse jwtResponse = new JwtResponse("token123", roles);

        assertEquals("token123", jwtResponse.getToken());
        assertEquals("Bearer", jwtResponse.getType());
        assertNull(jwtResponse.getId());
        assertNull(jwtResponse.getUsername());
        assertNull(jwtResponse.getEmail());
        assertNull(jwtResponse.getEmpId());
        assertNull(jwtResponse.getManagerId());
        assertNull(jwtResponse.getEmpName());
        assertNull(jwtResponse.getRoles()); // roles are not set in this constructor
    }
}
