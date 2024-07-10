package com.nominationsystem.tracers.models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class EmployeeTest {

    private Employee employee;

    @BeforeEach
    public void setUp() {
        employee = new Employee();
    }

    @Test
    public void testNoArgsConstructor() {
        assertThat(employee).isNotNull();
        assertThat(employee.getId()).isNull();
        assertThat(employee.getEmpName()).isNull();
        assertThat(employee.getEmpId()).isNull();
        assertThat(employee.getUsername()).isNull();
        assertThat(employee.getEmail()).isNull();
        assertThat(employee.getPassword()).isNull();
        assertThat(employee.getRole()).isNull();
        assertThat(employee.getBand()).isNull();
        assertThat(employee.getPendingCourses()).isEmpty();
        assertThat(employee.getApprovedCourses()).isEmpty();
        assertThat(employee.getPendingCertifications()).isEmpty();
        assertThat(employee.getCertifications()).isEmpty();
        assertThat(employee.getCompletedCourses()).isEmpty();
        assertThat(employee.getManagerId()).isNull();
    }

    @Test
    public void testGettersAndSetters() {
        // Given
        String empName = "John Doe";
        String empId = "emp1";
        String username = "johndoe";
        String email = "johndoe@example.com";
        String password = "password";
        String role = "employee";
        String band = "B1";
        String managerId = "mgr1";

        // When
        employee.setEmpName(empName);
        employee.setEmpId(empId);
        employee.setUsername(username);
        employee.setEmail(email);
        employee.setPassword(password);
        employee.setRole(role);
        employee.setBand(band);
        employee.setManagerId(managerId);

        // Then
        assertThat(employee.getEmpName()).isEqualTo(empName);
        assertThat(employee.getEmpId()).isEqualTo(empId);
        assertThat(employee.getUsername()).isEqualTo(username);
        assertThat(employee.getEmail()).isEqualTo(email);
        assertThat(employee.getPassword()).isEqualTo(password);
        assertThat(employee.getRole()).isEqualTo(role);
        assertThat(employee.getBand()).isEqualTo(band);
        assertThat(employee.getManagerId()).isEqualTo(managerId);
    }

    @Test
    public void testRemovePendingCourseById() {
        // Given
        EmployeeCourseStatus course1 = new EmployeeCourseStatus("course1", "pending");
        EmployeeCourseStatus course2 = new EmployeeCourseStatus("course2", "pending");
        employee.getPendingCourses().add(course1);
        employee.getPendingCourses().add(course2);

        // When
        employee.removePendingCourseById("course1");

        // Then
        assertThat(employee.getPendingCourses()).containsExactly(course2);
    }

    @Test
    public void testRemoveAssignedCourseById() {
        // Given
        EmployeeCourseStatus course1 = new EmployeeCourseStatus("course1", "approved");
        EmployeeCourseStatus course2 = new EmployeeCourseStatus("course2", "approved");
        employee.getApprovedCourses().add(course1);
        employee.getApprovedCourses().add(course2);

        // When
        employee.removeAssignedCourseById("course1");

        // Then
        assertThat(employee.getApprovedCourses()).containsExactly(course2);
    }

    @Test
    public void testIsCertificationPresent() {
        // Given
        CertificationStatus cert1 = new CertificationStatus();
        cert1.setCertificationId("cert1");
        cert1.setStatus("approved");
        CertificationStatus cert2 = new CertificationStatus();
        cert2.setCertificationId("cert2");
        cert2.setStatus("pending");
        employee.getCertifications().add(cert1);
        employee.getCertifications().add(cert2);

        // Then
        assertThat(employee.isCertificationPresent("cert1")).isTrue();
        assertThat(employee.isCertificationPresent("cert3")).isFalse();
    }
}
