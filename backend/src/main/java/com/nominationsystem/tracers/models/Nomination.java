package com.nominationsystem.tracers.models;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.text.SimpleDateFormat;
import java.time.Month;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Document(collection = "Nomination")
public class Nomination {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String nominationId;

    private String empName;

    private String empId;

    private String managerId;

    private Month month;

    private List<NominatedCourseStatus> nominatedCourses = new ArrayList<>();

    private List<String> certifId = new ArrayList<>();

    private String nominationDate = new SimpleDateFormat("dd-MM-yyyy").format(new Date());

    private String courseSuggestions;

    public void setId(String nom1) {
    }

    public void setCourseId(String course1) {
    }

    public void setEmployeeId(String emp1) {
    }
}
