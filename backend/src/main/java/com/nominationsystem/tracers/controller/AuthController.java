package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.Employee;
import com.nominationsystem.tracers.payload.request.LoginRequest;
import com.nominationsystem.tracers.payload.request.SignupRequest;
import com.nominationsystem.tracers.payload.response.JwtResponse;
import com.nominationsystem.tracers.payload.response.MessageResponse;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import com.nominationsystem.tracers.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        String jwt = null;
        try {

            this.employeeRepository.findByUsername(loginRequest.getUsername());
            Authentication authentication = this.authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            jwt = this.jwtUtils.generateJwtToken(authentication);

        } catch (Exception e2) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e2);
        }
        return ResponseEntity.ok(new JwtResponse(jwt));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {

        if (this.employeeRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (this.employeeRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        Employee user = new Employee();
        user.setUsername(signUpRequest.getUsername());// email is also set by this
        user.setPassword(this.encoder.encode(signUpRequest.getPassword()));
        user.setRole(signUpRequest.getRole());
        this.employeeRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
