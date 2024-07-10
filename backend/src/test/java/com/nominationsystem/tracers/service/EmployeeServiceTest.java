package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.*;
import com.nominationsystem.tracers.repository.CertificationRepository;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private CertificationRepository certificationRepository;

    @Mock
    private CourseService courseService;

    @Mock
    private CertificationService certificationService;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee employee;
    private List<EmployeeCourseStatus> courseList;
    private Course course;

    @BeforeEach
    public void setUp() {
        employee = new Employee();
        employee.setEmpId("emp1");
        employee.setEmpName("John Doe");
        employee.setEmail("john.doe@example.com");
        employee.setApprovedCourses(new ArrayList<>());
        employee.setPendingCourses(new ArrayList<>());
        employee.setCompletedCourses(new ArrayList<>());

        courseList = new ArrayList<>();
        courseList.add(new EmployeeCourseStatus("course1", "01-01-2024"));

        course = new Course();
        course.setCourseId("course1");
        course.setCourseName("Course 1");
        course.setDomain("IT");
    }

    @Test
    void testGetEmployeeRepository() {
        assertEquals(employeeRepository, employeeService.getEmployeeRepository());
    }


    @Test
    public void testGetAllEmployees() {
        List<Employee> employees = Arrays.asList(employee);
        when(employeeRepository.findAll()).thenReturn(employees);

        List<Employee> result = employeeService.getAllEmployees();

        assertEquals(employees, result);
        verify(employeeRepository, times(1)).findAll();
    }

    @Test
    public void testGetEmpByEmail() {
        String email = "john.doe@example.com";
        when(employeeRepository.findByEmail(email)).thenReturn(Optional.of(employee));

        ResponseEntity<?> response = employeeService.getEmpByEmail(email);

        assertEquals(ResponseEntity.ok(employee), response);
        verify(employeeRepository, times(1)).findByEmail(email);
    }

    @Test
    public void testGetEmpByEmail_NotFound() {
        String email = "john.doe@example.com";
        when(employeeRepository.findByEmail(email)).thenReturn(Optional.empty());

        ResponseEntity<?> response = employeeService.getEmpByEmail(email);

        assertEquals(ResponseEntity.notFound().build(), response);
        verify(employeeRepository, times(1)).findByEmail(email);
    }

    @Test
    public void testSetRole() {
        String email = "john.doe@example.com";
        String role = "Manager";
        when(employeeRepository.findByEmail(email)).thenReturn(Optional.of(employee));

        ResponseEntity<?> response = employeeService.setRole(email, role);

        assertEquals(ResponseEntity.ok(employee), response);
        assertEquals(role, employee.getRole());
        verify(employeeRepository, times(1)).save(employee);
    }

    @Test
    public void testSetRole_NotFound() {
        String email = "john.doe@example.com";
        String role = "Manager";
        when(employeeRepository.findByEmail(email)).thenReturn(Optional.empty());

        ResponseEntity<?> response = employeeService.setRole(email, role);

        assertEquals(ResponseEntity.notFound().build(), response);
        verify(employeeRepository, times(1)).findByEmail(email);
    }

    @Test
    public void testGetEmployee() {
        String empId = "emp1";
        when(employeeRepository.findByEmpId(empId)).thenReturn(employee);

        Employee result = employeeService.getEmployee(empId);

        assertEquals(employee, result);
        verify(employeeRepository, times(1)).findByEmpId(empId);
    }

    @Test
    public void testSetCoursesNominatedByEmployee() {
        String empId = "emp1";
        List<NominatedCourseStatus> nominatedCourses = new ArrayList<>();

        NominatedCourseStatus course1 = new NominatedCourseStatus();
        course1.setCourseId("course1");
        course1.setApprovalStatus(ApprovalStatus.APPROVED);

        NominatedCourseStatus course2 = new NominatedCourseStatus();
        course2.setCourseId("course2");
        course2.setApprovalStatus(ApprovalStatus.PENDING);

        nominatedCourses.add(course1);
        nominatedCourses.add(course2);
        String date = "01-01-2024";

        when(employeeRepository.findByEmpId(empId)).thenReturn(employee);

        employeeService.setCoursesNominatedByEmployee(empId, nominatedCourses, date);

        assertEquals(1, employee.getApprovedCourses().size());
        assertEquals(1, employee.getPendingCourses().size());
        verify(employeeRepository, times(1)).save(employee);
    }

    @Test
    public void testGetCoursesNominatedByEmployee() {
        String empId = "emp1";
        when(employeeRepository.findByEmpId(empId)).thenReturn(employee);

        Map<String, List<EmployeeCourseStatus>> result = employeeService.getCoursesNominatedByEmployee(empId);

        assertEquals(employee.getApprovedCourses(), result.get("approvedCourses"));
        assertEquals(employee.getPendingCourses(), result.get("pendingCourses"));
        assertEquals(employee.getCompletedCourses(), result.get("completedCourses"));
    }

    @Test
    public void testUpdateCoursesNominatedByEmployee_Approve() {
        String empId = "emp1";
        String courseId = "course1";
        String action = "approve";
        String date = "01-01-2024";

        employee.getPendingCourses().add(new EmployeeCourseStatus(courseId, date));
        when(employeeRepository.findByEmpId(empId)).thenReturn(employee);

        employeeService.updateCoursesNominatedByEmployee(empId, courseId, action, date);

        assertEquals(0, employee.getPendingCourses().size());
        assertEquals(1, employee.getApprovedCourses().size());
        verify(employeeRepository, times(1)).save(employee);
    }

    @Test
    public void testUpdateCoursesNominatedByEmployee_Reject() {
        String empId = "emp1";
        String courseId = "course1";
        String action = "reject";
        String date = "01-01-2024";

        employee.getPendingCourses().add(new EmployeeCourseStatus(courseId, date));
        when(employeeRepository.findByEmpId(empId)).thenReturn(employee);

        employeeService.updateCoursesNominatedByEmployee(empId, courseId, action, date);

        assertEquals(0, employee.getPendingCourses().size());
        assertEquals(0, employee.getApprovedCourses().size());
        verify(employeeRepository, times(1)).save(employee);
    }

    @Test
    public void testIsApprovedCoursePresent() {
        String empId = "emp1";
        String courseId = "course1";
        employee.getApprovedCourses().add(new EmployeeCourseStatus(courseId, "01-01-2024"));

        when(employeeRepository.findByEmpId(empId)).thenReturn(employee);

        Boolean result = employeeService.isApprovedCoursePresent(courseId, empId);

        assertTrue(result);
    }

    @Test
    public void testIsPendingCoursePresent() {
        String empId = "emp1";
        String courseId = "course1";
        employee.getPendingCourses().add(new EmployeeCourseStatus(courseId, "01-01-2024"));

        when(employeeRepository.findByEmpId(empId)).thenReturn(employee);

        Boolean result = employeeService.isPendingCoursePresent(courseId, empId);

        assertTrue(result);
    }

    @Test
    public void testGetEmployeeReport() {
        employee.setCompletedCourses(new ArrayList<>(courseList));
        List<Employee> employees = Arrays.asList(employee);

        when(employeeRepository.findAll()).thenReturn(new ArrayList<>(employees));
        when(courseService.getCourseById(anyString())).thenReturn(course);

        EmployeeReportCourseDetails courseDetails = new EmployeeReportCourseDetails();
        courseDetails.setCourseName(course.getCourseName());
        courseDetails.setDomain(course.getDomain());
        courseDetails.setDate("01-01-2024");

        ArrayList<EmployeeReportCourseDetails> courseDetailsList = new ArrayList<>();
        courseDetailsList.add(courseDetails);

        List<EmployeeReportTemplate> result = employeeService.getEmployeeReport();

        assertEquals(1, result.size());
        assertEquals(employee.getEmpId(), result.get(0).getEmpId());
        assertEquals(employee.getEmpName(), result.get(0).getEmpName());
        assertEquals(courseDetailsList.get(0).getCourseName(), result.get(0).getCompletedCourses().get(0).getCourseName());
    }

    @Test
    public void testGetDetailsOfCourseByEmployee() {
        when(courseService.getCourseById(anyString())).thenReturn(course);

        ArrayList<EmployeeReportCourseDetails> result = employeeService.getDetailsOfCourseByEmployee(new ArrayList<>(courseList));

        System.out.println(result.get(0).getCourseName());
        assertEquals(1, result.size());
        assertEquals("Course 1", result.get(0).getCourseName());
        assertEquals("IT", result.get(0).getDomain());
        assertEquals("01-01-2024", result.get(0).getDate());
    }

    @Test
    public void testGetCertificationRequests() {
        String managerId = "manager1";
        Certification certification = new Certification();
        certification.setCertificationId("cert1");
        List<Certification> certifications = Arrays.asList(certification);
        List<Employee> employees = Arrays.asList(employee);
        employee.getPendingCertifications().add("cert1");

        when(certificationService.getCertificationRepository()).thenReturn(certificationRepository);
        when(employeeRepository.findByManagerId(managerId)).thenReturn(employees);
        when(certificationService.getCertificationRepository().findAll()).thenReturn(certifications);

        List<CertificationRequestsTemplate> result = employeeService.getCertificationRequests(managerId);

        assertEquals(1, result.size());
        assertEquals(employee.getEmpId(), result.get(0).getEmpId());
        assertEquals(employee.getEmpName(), result.get(0).getEmpName());
        assertEquals(1, result.get(0).getPendingCertDetails().size());
        assertEquals(certification, result.get(0).getPendingCertDetails().get(0));
    }
}
