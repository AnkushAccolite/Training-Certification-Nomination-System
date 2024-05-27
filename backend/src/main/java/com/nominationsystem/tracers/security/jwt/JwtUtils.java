package com.nominationsystem.tracers.security.jwt;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.nominationsystem.tracers.service.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${jwtSecret}")
    private String jwtSecret;

    @Value("${jwtExpirationMs}")
    private int jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {

        UserDetailsImpl userDetailsImpl = (UserDetailsImpl) authentication.getPrincipal();
        System.out.println(userDetailsImpl.getId() + "---" + userDetailsImpl.getUsername() + "---");
        Map<String, Object> additionalClaims = new HashMap<>();
        additionalClaims.put("id", userDetailsImpl.getId());
        additionalClaims.put("username", userDetailsImpl.getUsername());
        additionalClaims.put("email", userDetailsImpl.getEmail());
        additionalClaims.put("empName", userDetailsImpl.getEmpName());
        additionalClaims.put("empId", userDetailsImpl.getEmpId());
        additionalClaims.put("managerId", userDetailsImpl.getManagerId());

        List<String> roleNames = userDetailsImpl.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        additionalClaims.put("role", roleNames);
        return Jwts.builder()
                //.setSubject(userDetailsImpl.getUsername())
                .setClaims(additionalClaims)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + this.jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(this.jwtSecret));
    }

    public String getUserNameFromJwtToken(String token) {
//	    return Jwts.parserBuilder().setSigningKey(key()).build()
//	               .parseClaimsJws(token).getBody().getSubject();
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return (String) claims.get("username");
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }

}
