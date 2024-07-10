package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.*;
import com.nominationsystem.tracers.service.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import com.nominationsystem.tracers.models.Employee;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EmployeeControllerTest {

    @Mock
    private EmployeeService employeeService;

    @InjectMocks
    private EmployeeController employeeController;

    private CourseFeedback courseFeedback;
    private Map<String, String> requestBody;


    private Employee employee;
    private Employee testEmployee;
    private EmployeeCourseStatus courseStatus1;
    private EmployeeCourseStatus courseStatus2;

    @BeforeEach
    public void setUp() {
        courseFeedback = new CourseFeedback();
        courseFeedback.setComment("Great course!");

        requestBody = new HashMap<>();
        requestBody.put("email", "test@example.com");

        employee = new Employee();
        employee.setId("emp1");

        testEmployee = new Employee();
        testEmployee.setId("emp1");
        testEmployee.setEmpName("John Doe");
        testEmployee.setEmail("john.doe@example.com");
        testEmployee.setPassword("password");
        testEmployee.setRole("ROLE_USER");

        courseStatus1 = new EmployeeCourseStatus("course1", "2024-07-10");
        courseStatus2 = new EmployeeCourseStatus("course2", "2024-07-11");
    }

    @Test
    public void testGetEmployees() {
        List<Employee> employees = new ArrayList<>();
        employees.add(employee);
        employees.add(testEmployee);

        when(employeeService.getAllEmployees()).thenReturn(employees);

        ResponseEntity<?> response = employeeController.getEmployees();

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testGetEmployeeByEmail() {
        String email = "test@accolitedigital.com";

        when(employeeService.getEmpByEmail(anyString())).thenReturn(ResponseEntity.ok().build());

        ResponseEntity<?> response = employeeController.getEmployeeByEmail(email);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testSetRole() {
        String email = "test@example.com";
        String role = "Admin";

        when(employeeService.setRole(anyString(), anyString())).thenReturn(ResponseEntity.ok().build());

        ResponseEntity<?> response = employeeController.setRole(email, role);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testGetEmployeeReport() {
        List<EmployeeReportTemplate> reports = new ArrayList<>();
        reports.add(new EmployeeReportTemplate());

        when(employeeService.getEmployeeReport()).thenReturn(reports);

        List<EmployeeReportTemplate> response = employeeController.getEmployeeReport();

        assertEquals(reports, response);
    }

    @Test
    public void testGetCertificationRequests() {
        List<CertificationRequestsTemplate> certificationRequests = new ArrayList<>();
        certificationRequests.add(new CertificationRequestsTemplate());

        when(employeeService.getCertificationRequests(anyString())).thenReturn(certificationRequests);

        List<CertificationRequestsTemplate> response = employeeController.getCertificationRequests("manager1");

        assertEquals(certificationRequests, response);
    }

    @Test
    public void testGetCoursesNominatedByEmployee() {
        String empId = "emp1";

        // Prepare mock data
        List<EmployeeCourseStatus> approvedCourses = new ArrayList<>();
        approvedCourses.add(courseStatus1);
        approvedCourses.add(courseStatus2);

        Map<String, List<EmployeeCourseStatus>> mockCourseMap = new HashMap<>();
        mockCourseMap.put("approvedCourses", approvedCourses);
        mockCourseMap.put("pendingCourses", new ArrayList<>());
        mockCourseMap.put("completedCourses", new ArrayList<>());

        // Mock behavior of EmployeeService.getCoursesNominatedByEmployee
        when(employeeService.getCoursesNominatedByEmployee(anyString())).thenReturn(mockCourseMap);

        // Call the controller method
        Map<String, List<EmployeeCourseStatus>> response = employeeController.getCoursesNominatedByEmployee(empId);

        // Assertions
        assertEquals(2, response.get("approvedCourses").size());
        assertEquals(courseStatus1, response.get("approvedCourses").get(0));
        assertEquals(courseStatus2, response.get("approvedCourses").get(1));
        assertEquals(0, response.get("pendingCourses").size());
        assertEquals(0, response.get("completedCourses").size());
    }

}
