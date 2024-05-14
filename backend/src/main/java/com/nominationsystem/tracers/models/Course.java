package com.nominationsystem.tracers.models;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Document(collection = "Course")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String courseId;

    @NotBlank
    @Size(min = 2, max = 50)
    private String courseName;

    private Integer duration;

    @NotBlank
    private String category;

    @NotBlank
    private String description;

    private Boolean isApprovalReq;

    private List<MonthlyCourseStatus> monthlyStatus = new ArrayList<>();

    private String publishedDate = new SimpleDateFormat("dd-MM-yyyy").format(new Date());
}
