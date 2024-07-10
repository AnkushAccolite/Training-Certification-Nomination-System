package com.nominationsystem.tracers.models;

import jakarta.validation.constraints.NotBlank;
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
@Document(collection = "Course")
public class Course {

    @Id
    private String courseId;

    private String courseName;

    private Integer duration;

    @NotBlank
    private String domain;

    @NotBlank
    private String description;

    private Boolean isApprovalReq;

    private Boolean delete = false;

    private List<MonthlyCourseStatus> monthlyStatus = List.of(
            new MonthlyCourseStatus(Month.JANUARY, new ArrayList<>()),
            new MonthlyCourseStatus(Month.FEBRUARY, new ArrayList<>()),
            new MonthlyCourseStatus(Month.MARCH, new ArrayList<>()),
            new MonthlyCourseStatus(Month.APRIL, new ArrayList<>()),
            new MonthlyCourseStatus(Month.MAY, new ArrayList<>()),
            new MonthlyCourseStatus(Month.JUNE, new ArrayList<>()),
            new MonthlyCourseStatus(Month.JULY, new ArrayList<>()),
            new MonthlyCourseStatus(Month.AUGUST, new ArrayList<>()),
            new MonthlyCourseStatus(Month.SEPTEMBER, new ArrayList<>()),
            new MonthlyCourseStatus(Month.OCTOBER, new ArrayList<>()),
            new MonthlyCourseStatus(Month.NOVEMBER, new ArrayList<>()),
            new MonthlyCourseStatus(Month.DECEMBER, new ArrayList<>()));

    private String publishedDate = new SimpleDateFormat("dd-MM-yyyy").format(new Date());

}
