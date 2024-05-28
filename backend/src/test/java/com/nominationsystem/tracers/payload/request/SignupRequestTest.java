package com.nominationsystem.tracers.payload.request;

import static org.junit.jupiter.api.Assertions.assertTrue;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

public class SignupRequestTest {

    private static Validator validator;

    @BeforeAll
    public static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    // @Test
    // public void testGettersAndSetters() {
    // SignupRequest signupRequest = new SignupRequest();
    // signupRequest.setUsername("testUser");
    // signupRequest.setEmail("test@example.com");
    // signupRequest.setPassword("testPass123");
    // signupRequest.setRole("USER");
    //
    // assertEquals("testUser", signupRequest.getUsername());
    // assertEquals("test@example.com", signupRequest.getEmail());
    // assertEquals("testPass123", signupRequest.getPassword());
    // assertEquals("USER", signupRequest.getRole());
    // }

    @Test
    public void testUsernameNotBlank() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("");
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("testPass123");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("username")));
    }

    @Test
    public void testUsernameSize() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("ab");
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("testPass123");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("username")));
    }

    @Test
    public void testEmailNotBlank() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("testUser");
        signupRequest.setEmail("");
        signupRequest.setPassword("testPass123");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }

    @Test
    public void testEmailFormat() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("testUser");
        signupRequest.setEmail("invalid-email");
        signupRequest.setPassword("testPass123");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }

    @Test
    public void testPasswordNotBlank() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("testUser");
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }

    @Test
    public void testPasswordSize() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("testUser");
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("12345");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }

    // @Test
    // public void testValidSignupRequest() {
    // SignupRequest signupRequest = new SignupRequest();
    // signupRequest.setUsername("testUser");
    // signupRequest.setEmail("test@example.com");
    // signupRequest.setPassword("testPass123");
    // signupRequest.setRole("USER");
    //
    // Set<ConstraintViolation<SignupRequest>> violations =
    // validator.validate(signupRequest);
    // assertEquals(0, violations.size());
    // }
}
