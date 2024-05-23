package com.nominationsystem.tracers.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.*;

@Getter
@Setter
@Document(collection = "employees")
public class Employee {
    @Id
    private String id;

    private String empName;

    private String empId;

    @NotBlank
    @Size(max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(max = 120)
    private String password;

    private String role;

    private ArrayList<EmployeeCourseStatus> pendingCourses = new ArrayList<>();

    private ArrayList<EmployeeCourseStatus> approvedCourses = new ArrayList<>();

    private ArrayList<String> pendingCertifications = new ArrayList<>();

    private ArrayList<CertificationStatus> certifications = new ArrayList<>();

    private ArrayList<EmployeeCourseStatus> completedCourses = new ArrayList<>();

    private String managerId;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
        this.email = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void removePendingCourseById(String courseId) {
        Iterator<EmployeeCourseStatus> iterator = this.getPendingCourses().iterator();
        while (iterator.hasNext()) {
            EmployeeCourseStatus courseStatus = iterator.next();
            if (courseStatus.getCourseId().equals(courseId)) {
                iterator.remove();

            }
        }

    }

    public void removeAssignedCourseById(String courseId) {
        Iterator<EmployeeCourseStatus> iterator = this.getApprovedCourses().iterator();
        while (iterator.hasNext()) {
            EmployeeCourseStatus courseStatus = iterator.next();
            if (courseStatus.getCourseId().equals(courseId)) {
                iterator.remove();
            }
        }
    }

    public boolean isCertificationPresent(String certificationId) {
        return this.certifications.stream()
                .anyMatch(certification -> certification.getCertificationId().equals(certificationId));
    }

}
