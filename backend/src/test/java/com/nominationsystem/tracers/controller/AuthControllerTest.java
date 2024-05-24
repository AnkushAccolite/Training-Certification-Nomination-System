package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.payload.request.LoginRequest;
import com.nominationsystem.tracers.payload.request.SignupRequest;
import com.nominationsystem.tracers.payload.response.JwtResponse;
import com.nominationsystem.tracers.payload.response.MessageResponse;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import com.nominationsystem.tracers.security.jwt.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    public void setUp() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void testAuthenticateUserSuccess() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password");

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("test-jwt-token");

        // Act
        ResponseEntity<?> response = authController.authenticateUser(loginRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("test-jwt-token", ((JwtResponse) response.getBody()).getToken());
    }

    @Test
    public void testAuthenticateUserFailure() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("invaliduser");
        loginRequest.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Invalid credentials"));

        // Act
        ResponseEntity<?> response = authController.authenticateUser(loginRequest);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testRegisterUserSuccess() {
        // Arrange
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("newuser");
        signupRequest.setPassword("password");
        signupRequest.setEmail("newuser@example.com");
        signupRequest.setRole("USER");

        when(employeeRepository.existsByUsername(signupRequest.getUsername())).thenReturn(false);
        when(employeeRepository.existsByEmail(signupRequest.getEmail())).thenReturn(false);
        when(encoder.encode(signupRequest.getPassword())).thenReturn("encoded-password");

        // Act
        ResponseEntity<?> response = authController.registerUser(signupRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User registered successfully!", ((MessageResponse) response.getBody()).getMessage());
    }

    @Test
    public void testRegisterUserUsernameTaken() {
        // Arrange
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("existinguser");
        signupRequest.setPassword("password");
        signupRequest.setEmail("existinguser@example.com");
        signupRequest.setRole("USER");

        when(employeeRepository.existsByUsername(signupRequest.getUsername())).thenReturn(true);

        // Act
        ResponseEntity<?> response = authController.registerUser(signupRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Error: Username is already taken!", ((MessageResponse) response.getBody()).getMessage());
    }

    @Test
    public void testRegisterUserEmailTaken() {
        // Arrange
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("newuser");
        signupRequest.setPassword("password");
        signupRequest.setEmail("existingemail@example.com");
        signupRequest.setRole("USER");

        when(employeeRepository.existsByUsername(signupRequest.getUsername())).thenReturn(false);
        when(employeeRepository.existsByEmail(signupRequest.getEmail())).thenReturn(true);

        // Act
        ResponseEntity<?> response = authController.registerUser(signupRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Error: Email is already in use!", ((MessageResponse) response.getBody()).getMessage());
    }
}

