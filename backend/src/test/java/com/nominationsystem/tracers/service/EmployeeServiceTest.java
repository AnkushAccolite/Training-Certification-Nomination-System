package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.*;
import com.nominationsystem.tracers.repository.CourseFeedbackRepository;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private CourseService courseService;

    @Mock
    private CourseFeedbackRepository courseFeedbackRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee employee;
    private CourseFeedback courseFeedback;

    @BeforeEach
    public void setUp() {
        employee = new Employee();
        employee.setEmpId("emp1");
        employee.setEmpName("John Doe");

        courseFeedback = new CourseFeedback();
        courseFeedback.setId("feedback1");
        courseFeedback.setFeedback("Good course!");
    }

    @Test
    public void testGetAllEmployees() {
        List<Employee> employees = Arrays.asList(employee);
        when(employeeRepository.findAll()).thenReturn(employees);

        List<Employee> result = employeeService.getAllEmployees();

        assertEquals(employees, result);
    }

//    @Test
//    public void testGetEmpByEmail() {
//        String email = "john@example.com";
//        when(employeeRepository.findByEmail(email)).thenReturn(Optional.of(employee));
//
//        Map<String, String> requestBody = new HashMap<>();
//        requestBody.put("email", email);
//
//        ResponseEntity<?> result = employeeService.getEmpByEmail(requestBody.toString());
//
//        assertEquals(ResponseEntity.ok(employee), result);
//    }
}
