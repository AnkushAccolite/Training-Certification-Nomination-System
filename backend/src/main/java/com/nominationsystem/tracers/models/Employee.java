package com.nominationsystem.tracers.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.*;

@Getter
@Setter
@NoArgsConstructor
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

    private String band;

    private ArrayList<EmployeeCourseStatus> pendingCourses = new ArrayList<>();

    private ArrayList<EmployeeCourseStatus> approvedCourses = new ArrayList<>();

    private ArrayList<String> pendingCertifications = new ArrayList<>();

    private ArrayList<CertificationStatus> certifications = new ArrayList<>();

    private ArrayList<EmployeeCourseStatus> completedCourses = new ArrayList<>();

    private String managerId;

    public void setUsername(String username) {
        this.username = username;
        this.email = username;
    }

    public void removePendingCourseById(String courseId) {
        this.getPendingCourses().removeIf(courseStatus -> courseStatus.getCourseId().equals(courseId));
    }

    public void removeAssignedCourseById(String courseId) {
        this.getApprovedCourses().removeIf(courseStatus -> courseStatus.getCourseId().equals(courseId));
    }

    public boolean isCertificationPresent(String certificationId) {
        return this.certifications.stream()
                .anyMatch(certification -> certification.getCertificationId().equals(certificationId));
    }

}
