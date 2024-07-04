package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.Employee;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import static org.junit.jupiter.api.Assertions.*;

public class UserDetailsImplTest {

    private UserDetailsImpl userDetails;

    @BeforeEach
    public void setUp() {
        userDetails = new UserDetailsImpl(
                "1",                      // id
                "testuser",               // username
                "test@example.com",       // email
                "password",               // password
                "ROLE_USER",              // role
                "empId",                  // empId
                "managerId",              // managerId
                "empName",                // empName
                "band"                    // band
        );
    }

    @Test
    public void testBuildFromEmployee() {
        // Given
        Employee employee = new Employee();
        employee.setId("1");
        employee.setUsername("testuser");
        employee.setEmail("test@example.com");
        employee.setPassword("password");
        employee.setRole("ROLE_USER");
        employee.setEmpId("empId");
        employee.setManagerId("managerId");
        employee.setEmpName("empName");
        employee.setBand("band");

        // When
        UserDetailsImpl builtUserDetails = UserDetailsImpl.build(employee);

        // Then
        assertNotNull(builtUserDetails);
        assertEquals(userDetails.getId(), builtUserDetails.getId());
        assertEquals(userDetails.getUsername(), builtUserDetails.getUsername());
        assertEquals(userDetails.getEmail(), builtUserDetails.getEmail());
        assertEquals(userDetails.getPassword(), builtUserDetails.getPassword());
        assertEquals(userDetails.getAuthorities().iterator().next().getAuthority(), builtUserDetails.getAuthorities().iterator().next().getAuthority());
        assertEquals(userDetails.getEmpId(), builtUserDetails.getEmpId());
        assertEquals(userDetails.getManagerId(), builtUserDetails.getManagerId());
        assertEquals(userDetails.getEmpName(), builtUserDetails.getEmpName());
        assertEquals(userDetails.getBand(), builtUserDetails.getBand());
    }

    @Test
    public void testGetAuthorities() {
        // When
        var authorities = userDetails.getAuthorities();

        // Then
        assertEquals(1, authorities.size());
        assertTrue(authorities.contains(new SimpleGrantedAuthority("ROLE_USER")));
    }

    @Test
    public void testIsAccountNonExpired() {
        // When
        boolean isAccountNonExpired = userDetails.isAccountNonExpired();

        // Then
        assertTrue(isAccountNonExpired);
    }

    @Test
    public void testIsAccountNonLocked() {
        // When
        boolean isAccountNonLocked = userDetails.isAccountNonLocked();

        // Then
        assertTrue(isAccountNonLocked);
    }

    @Test
    public void testIsCredentialsNonExpired() {
        // When
        boolean isCredentialsNonExpired = userDetails.isCredentialsNonExpired();

        // Then
        assertTrue(isCredentialsNonExpired);
    }

    @Test
    public void testIsEnabled() {
        // When
        boolean isEnabled = userDetails.isEnabled();

        // Then
        assertTrue(isEnabled);
    }

    @Test
    public void testToString() {
        // When
        String userDetailsString = userDetails.toString();

        // Then
        assertTrue(userDetailsString.contains("UserDetailsImpl"));
        assertTrue(userDetailsString.contains("id=1"));
        assertTrue(userDetailsString.contains("username=testuser"));
        assertTrue(userDetailsString.contains("email=test@example.com"));
        assertTrue(userDetailsString.contains("role=ROLE_USER"));
        assertTrue(userDetailsString.contains("password=password"));
        assertFalse(userDetailsString.contains("empId=empId"));
        assertFalse(userDetailsString.contains("managerId=managerId"));
        assertFalse(userDetailsString.contains("empName=empName"));
        assertFalse(userDetailsString.contains("band=band"));
    }

    @Test
    public void testGetters() {
        // Then
        assertEquals("1", userDetails.getId());
        assertEquals("testuser", userDetails.getUsername());
        assertEquals("test@example.com", userDetails.getEmail());
        assertEquals("password", userDetails.getPassword());
        assertEquals("ROLE_USER", userDetails.getAuthorities().iterator().next().getAuthority());
        assertEquals("empId", userDetails.getEmpId());
        assertEquals("managerId", userDetails.getManagerId());
        assertEquals("empName", userDetails.getEmpName());
        assertEquals("band", userDetails.getBand());
    }

    @Test
    public void testEquals() {
        // Given
        UserDetailsImpl userDetails1 = new UserDetailsImpl(
                "1", "testuser1", "test1@example.com", "password1", "ROLE_USER1",
                "empId1", "managerId1", "empName1", "band1"
        );

        UserDetailsImpl userDetails2 = new UserDetailsImpl(
                "1", "testuser2", "test2@example.com", "password2", "ROLE_USER2",
                "empId2", "managerId2", "empName2", "band2"
        );

        UserDetailsImpl userDetails3 = new UserDetailsImpl(
                "2", "testuser3", "test3@example.com", "password3", "ROLE_USER3",
                "empId3", "managerId3", "empName3", "band3"
        );

        // Then
        assertTrue(userDetails1.equals(userDetails2));  // Should be true, same id
        assertFalse(userDetails1.equals(userDetails3)); // Should be false, different id
    }
}
