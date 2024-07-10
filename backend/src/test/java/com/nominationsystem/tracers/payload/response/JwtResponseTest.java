package com.nominationsystem.tracers.payload.response;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

public class JwtResponseTest {

    @Test
    public void testGettersAndSetters() {
        JwtResponse jwtResponse = new JwtResponse();

        jwtResponse.setToken("testToken");
        Assertions.assertEquals("testToken", jwtResponse.getToken());

        jwtResponse.setType("TestType");
        Assertions.assertEquals("TestType", jwtResponse.getType());

        jwtResponse.setId("testId");
        Assertions.assertEquals("testId", jwtResponse.getId());

        jwtResponse.setEmail("test@example.com");
        Assertions.assertEquals("test@example.com", jwtResponse.getEmail());

        jwtResponse.setUsername("testUser");
        Assertions.assertEquals("testUser", jwtResponse.getUsername());

        List<String> roles = Arrays.asList("ROLE_USER", "ROLE_ADMIN");
        jwtResponse.setRoles(roles);
        Assertions.assertEquals(roles, jwtResponse.getRoles());

        jwtResponse.setEmpName("John Doe");
        Assertions.assertEquals("John Doe", jwtResponse.getEmpName());

        jwtResponse.setEmpId("123456");
        Assertions.assertEquals("123456", jwtResponse.getEmpId());

        jwtResponse.setManagerId("987654");
        Assertions.assertEquals("987654", jwtResponse.getManagerId());

        jwtResponse.setBand("A");
        Assertions.assertEquals("A", jwtResponse.getBand());
    }

    @Test
    public void testConstructorWithToken() {
        JwtResponse jwtResponse = new JwtResponse("testToken");
        Assertions.assertEquals("testToken", jwtResponse.getToken());
    }

    @Test
    public void testConstructorWithTokenAndRoles() {
        List<String> roles = Arrays.asList("ROLE_USER", "ROLE_ADMIN");
        JwtResponse jwtResponse = new JwtResponse("testToken", roles);
        Assertions.assertEquals("testToken", jwtResponse.getToken());
    }
}
