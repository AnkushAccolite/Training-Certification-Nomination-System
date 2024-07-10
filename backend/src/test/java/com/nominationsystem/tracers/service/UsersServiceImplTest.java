package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.Employee;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UsersServiceImplTest {

    @InjectMocks
    private UsersServiceImpl usersService;

    @Mock
    private EmployeeService employeeService;

    @Mock
    private EmployeeRepository employeeRepository;

    @BeforeEach
    public void setUp() {
        when(employeeService.getEmployeeRepository()).thenReturn(employeeRepository);
    }

    @Test
    public void testGetUserByUsername() {
        String username = "testUser";
        Employee employee = new Employee();
        employee.setUsername(username);
        when(employeeRepository.findByUsername(username)).thenReturn(Optional.of(employee));

        Employee result = usersService.getUserByUsername(username);
        assertNotNull(result);
        assertEquals(username, result.getUsername());
    }

    @Test
    public void testGetUserByUsername_NotFound() {
        String username = "testUser";
        when(employeeRepository.findByUsername(username)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> usersService.getUserByUsername(username));
    }

    @Test
    public void testSaveUser() {
        Employee employee = new Employee();
        when(employeeRepository.save(employee)).thenReturn(employee);

        Employee result = usersService.saveUser(employee);
        assertNotNull(result);
        verify(employeeRepository, times(1)).save(employee);
    }

    @Test
    public void testIsUsernameExists() {
        String username = "testUser";
        when(employeeRepository.existsByUsername(username)).thenReturn(true);

        boolean result = usersService.isUsernameExists(username);
        assertTrue(result);
    }

    @Test
    public void testIsEmailExists() {
        String email = "test@example.com";
        when(employeeRepository.existsByEmail(email)).thenReturn(true);

        boolean result = usersService.isEmailExists(email);
        assertTrue(result);
    }
}
