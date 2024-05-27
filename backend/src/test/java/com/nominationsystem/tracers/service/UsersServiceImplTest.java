package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.Employee;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

public class UsersServiceImplTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private UsersServiceImpl usersService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetUserByUsername() {
        // Given
        String username = "testuser";
        Employee employee = new Employee();
        employee.setId("1");
        employee.setUsername(username);

        when(employeeRepository.findByUsername(username)).thenReturn(Optional.of(employee));

        // When
        Employee retrievedUser = usersService.getUserByUsername(username);

        // Then
        assertEquals(username, retrievedUser.getUsername());

        verify(employeeRepository, times(1)).findByUsername(username);
    }

    @Test
    public void testSaveUser() {
        // Given
        Employee userToSave = new Employee();
        userToSave.setUsername("testuser");

        Employee savedUser = new Employee();
        savedUser.setId("1");
        savedUser.setUsername("testuser");

        when(employeeRepository.save(userToSave)).thenReturn(savedUser);

        // When
        Employee returnedUser = usersService.saveUser(userToSave);

        // Then
        assertEquals(savedUser, returnedUser);

        verify(employeeRepository, times(1)).save(userToSave);
    }

    @Test
    public void testIsUsernameExists() {
        // Given
        String username = "existinguser";

        when(employeeRepository.existsByUsername(username)).thenReturn(true);

        // Then
        assertTrue(usersService.isUsernameExists(username));

        verify(employeeRepository, times(1)).existsByUsername(username);
    }

    @Test
    public void testIsEmailExists() {
        // Given
        String email = "existing@example.com";

        when(employeeRepository.existsByEmail(email)).thenReturn(true);

        // Then
        assertTrue(usersService.isEmailExists(email));

        verify(employeeRepository, times(1)).existsByEmail(email);
    }
}

