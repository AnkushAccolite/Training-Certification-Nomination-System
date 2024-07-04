package com.nominationsystem.tracers.payload.response;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

public class JwtResponseTest {

    @Test
    public void testGettersAndSetters() {
        // Create a JwtResponse object
        JwtResponse jwtResponse = new JwtResponse();

        // Test setter and getter for token
        jwtResponse.setToken("testToken");
        Assertions.assertEquals("testToken", jwtResponse.getToken());

        // Test setter and getter for type
        jwtResponse.setType("TestType");
        Assertions.assertEquals("TestType", jwtResponse.getType());

        // Test setter and getter for id
        jwtResponse.setId("testId");
        Assertions.assertEquals("testId", jwtResponse.getId());

        // Test setter and getter for email
        jwtResponse.setEmail("test@example.com");
        Assertions.assertEquals("test@example.com", jwtResponse.getEmail());

        // Test setter and getter for username
        jwtResponse.setUsername("testUser");
        Assertions.assertEquals("testUser", jwtResponse.getUsername());

        // Test setter and getter for roles
        List<String> roles = Arrays.asList("ROLE_USER", "ROLE_ADMIN");
        jwtResponse.setRoles(roles);
        Assertions.assertEquals(roles, jwtResponse.getRoles());

        // Test setter and getter for empName
        jwtResponse.setEmpName("John Doe");
        Assertions.assertEquals("John Doe", jwtResponse.getEmpName());

        // Test setter and getter for empId
        jwtResponse.setEmpId("123456");
        Assertions.assertEquals("123456", jwtResponse.getEmpId());

        // Test setter and getter for managerId
        jwtResponse.setManagerId("987654");
        Assertions.assertEquals("987654", jwtResponse.getManagerId());

        // Test setter and getter for band
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
        //Assertions.assertEquals(roles, jwtResponse.getRoles());
    }
}
