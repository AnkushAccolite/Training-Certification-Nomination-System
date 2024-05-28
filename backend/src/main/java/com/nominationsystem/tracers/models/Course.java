package com.nominationsystem.tracers.models;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.text.SimpleDateFormat;
import java.time.Month;
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
            new MonthlyCourseStatus(Month.JANUARY, false),
            new MonthlyCourseStatus(Month.FEBRUARY, false),
            new MonthlyCourseStatus(Month.MARCH, false),
            new MonthlyCourseStatus(Month.APRIL, false),
            new MonthlyCourseStatus(Month.MAY, false),
            new MonthlyCourseStatus(Month.JUNE, false),
            new MonthlyCourseStatus(Month.JULY, false),
            new MonthlyCourseStatus(Month.AUGUST, false),
            new MonthlyCourseStatus(Month.SEPTEMBER, false),
            new MonthlyCourseStatus(Month.OCTOBER, false),
            new MonthlyCourseStatus(Month.NOVEMBER, false),
            new MonthlyCourseStatus(Month.DECEMBER, false));

    private String publishedDate = new SimpleDateFormat("dd-MM-yyyy").format(new Date());

    public void setId(String course1) {
    }

    public void setName(String javaCourse) {
    }

}
