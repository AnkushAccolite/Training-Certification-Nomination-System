package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.CourseFeedback;
import com.nominationsystem.tracers.models.EmployeeCourseStatus;
import com.nominationsystem.tracers.models.EmployeeReportTemplate;
import com.nominationsystem.tracers.service.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmployeeControllerTest {

    @Mock
    private EmployeeService employeeService;

    @InjectMocks
    private EmployeeController employeeController;

    private CourseFeedback courseFeedback;
    private Map<String, String> requestBody;

    @BeforeEach
    public void setUp() {
        courseFeedback = new CourseFeedback();
        courseFeedback.setFeedback("Great course!");

        requestBody = new HashMap<>();
        requestBody.put("email", "test@example.com");
    }

    // @Test
    // public void testGetEmployees() {
    // List<Object> employees = new ArrayList<>();
    // employees.add(new Object()); // Replace with actual Employee objects as
    // needed
    //
    // when(employeeService.getAllEmployees()).thenReturn(employees);
    //
    // ResponseEntity<?> response = employeeController.getEmployees();
    //
    // assertEquals(HttpStatus.OK, response.getStatusCode());
    // assertEquals(employees, response.getBody());
    // }

    // @Test
    // public void testGetEmployeeByEmail() {
    // ResponseEntity<?> expectedResponse = new ResponseEntity<>(HttpStatus.OK);
    //
    // when(employeeService.getEmpByEmail(any(Map.class).toString())).thenReturn(expectedResponse);
    //
    // ResponseEntity<?> response =
    // employeeController.getEmployeeByEmail(requestBody.toString());
    //
    // assertEquals(expectedResponse, response);
    // }

    // @Test
    // public void testSetRole() {
    // ResponseEntity<?> expectedResponse = new ResponseEntity<>(HttpStatus.OK);
    //
    // when(employeeService.setRole(anyString(),
    // anyString())).thenReturn(expectedResponse);
    //
    // ResponseEntity<?> response = employeeController.setRole("test@example.com",
    // "Admin");
    //
    // assertEquals(expectedResponse, response);
    // }

    @Test
    public void testGetCoursesNominatedByEmployee() {
        Map<String, List<EmployeeCourseStatus>> courses = new HashMap<>();
        courses.put("test@example.com", new ArrayList<>());

        when(employeeService.getCoursesNominatedByEmployee(anyString())).thenReturn(courses);

        Map<String, List<EmployeeCourseStatus>> response = employeeController.getCoursesNominatedByEmployee("emp1");

        assertEquals(courses, response);
    }

    // @Test
    // public void testCourseCompleted() {
    // ResponseEntity<?> expectedResponse = new ResponseEntity<>(HttpStatus.OK);
    //
    // when(employeeService.courseCompleted(anyString(), anyString(),
    // any(CourseFeedback.class))).thenReturn(expectedResponse);
    //
    // ResponseEntity<?> response = employeeController.courseCompleted("course1",
    // "emp1", courseFeedback);
    //
    // assertEquals(expectedResponse, response);
    // }

    @Test
    public void testGetEmployeeReport() {
        List<EmployeeReportTemplate> reports = new ArrayList<>();
        reports.add(new EmployeeReportTemplate()); // Replace with actual EmployeeReportTemplate objects as needed

        when(employeeService.getEmployeeReport()).thenReturn(reports);

        List<EmployeeReportTemplate> response = employeeController.getEmployeeReport();

        assertEquals(reports, response);
    }
}
