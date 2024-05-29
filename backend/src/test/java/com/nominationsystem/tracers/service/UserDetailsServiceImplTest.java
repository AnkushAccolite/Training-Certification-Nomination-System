package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.Employee;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class UserDetailsServiceImplTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testLoadUserByUsername_Success() {
        // Given
        String username = "testuser";
        Employee employee = new Employee();
        employee.setId("1");
        employee.setUsername(username);
        employee.setEmail("test@example.com");
        employee.setPassword("password");
        employee.setRole("ROLE_USER");
        employee.setEmpId("empId");
        employee.setManagerId("managerId");
        employee.setEmpName("empName");

        when(employeeRepository.findByUsername(username)).thenReturn(Optional.of(employee));

        // When
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        // Then
        assertEquals(username, userDetails.getUsername());
        assertEquals(employee.getPassword(), userDetails.getPassword());
        assertEquals(employee.getRole(), userDetails.getAuthorities().iterator().next().getAuthority());

        verify(employeeRepository, times(1)).findByUsername(username);
    }

    @Test
    public void testLoadUserByUsername_UserNotFound() {
        // Given
        String username = "nonexistentuser";

        when(employeeRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Then
        assertThrows(UsernameNotFoundException.class, () -> userDetailsService.loadUserByUsername(username));

        verify(employeeRepository, times(1)).findByUsername(username);
    }
}
