package com.nominationsystem.tracers.models;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.util.List;

@Getter
@Setter
@Document(collection = "Employee")
public class Employee {

    @Id
    private String empId;

    @NotBlank
    private String name;

    @Email
    private String email;

    @NotBlank
    private String hashPswd;

    private String role;

    private Boolean isAdmin;

    private List<String> courseIds;

    private List<String> certificationIds;

    private Boolean eligibleForPromotions;

    private String managerId;
}
