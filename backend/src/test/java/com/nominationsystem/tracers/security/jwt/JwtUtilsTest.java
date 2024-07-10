package com.nominationsystem.tracers.security.jwt;

import com.nominationsystem.tracers.service.UserDetailsImpl;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.security.Key;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JwtUtilsTest {

    @InjectMocks
    private JwtUtils jwtUtils;

    @Mock
    private Authentication authentication;

    @Mock
    private UserDetailsImpl userDetailsImpl;

    private Key key;

    @BeforeEach
    public void setUp() {
        jwtUtils = new JwtUtils();
        key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        jwtUtils.jwtSecret = Base64.getEncoder().encodeToString(key.getEncoded());
        jwtUtils.jwtExpirationMs = 3600000; // 1 hour
    }

    @Test
    public void testGenerateJwtToken() {
        when(authentication.getPrincipal()).thenReturn(userDetailsImpl);
        when(userDetailsImpl.getId()).thenReturn("1");
        when(userDetailsImpl.getUsername()).thenReturn("testUser");
        when(userDetailsImpl.getEmail()).thenReturn("test@example.com");
        when(userDetailsImpl.getEmpName()).thenReturn("Test User");
        when(userDetailsImpl.getEmpId()).thenReturn("EMP123");
        when(userDetailsImpl.getManagerId()).thenReturn("MANAGER123");
        when(userDetailsImpl.getBand()).thenReturn("BAND123");

        String token = jwtUtils.generateJwtToken(authentication);
        assertNotNull(token);

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        assertEquals("1", claims.get("id"));
        assertEquals("testUser", claims.get("username"));
        assertEquals("test@example.com", claims.get("email"));
        assertEquals("Test User", claims.get("empName"));
        assertEquals("EMP123", claims.get("empId"));
        assertEquals("MANAGER123", claims.get("managerId"));
        assertEquals("BAND123", claims.get("band"));
    }

    @Test
    public void testGetUserNameFromJwtToken() {
        String token = createTestToken();

        String username = jwtUtils.getUserNameFromJwtToken(token);
        assertEquals("testUser", username);
    }

    @Test
    public void testValidateJwtToken_validToken() {
        String token = createTestToken();
        assertTrue(jwtUtils.validateJwtToken(token));
    }

    @Test
    public void testValidateJwtToken_invalidToken() {
        String token = "invalid.token.here";
        assertFalse(jwtUtils.validateJwtToken(token));
    }

    @Test
    public void testValidateJwtToken_expiredToken() {
        String expiredToken = createExpiredTestToken();
        assertFalse(jwtUtils.validateJwtToken(expiredToken));
    }

    @Test
    public void testValidateJwtToken_malformedToken() {
        String malformedToken = "malformed.token";
        assertFalse(jwtUtils.validateJwtToken(malformedToken));
    }

    @Test
    public void testValidateJwtToken_emptyToken() {
        assertFalse(jwtUtils.validateJwtToken(""));
    }

    @Test
    public void testValidateJwtToken_nullToken() {
        assertFalse(jwtUtils.validateJwtToken(null));
    }

    private String createTestToken() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", "testUser");

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtUtils.jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private String createExpiredTestToken() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", "testUser");

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis() - jwtUtils.jwtExpirationMs))
                .setExpiration(new Date(System.currentTimeMillis() - 1000))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
