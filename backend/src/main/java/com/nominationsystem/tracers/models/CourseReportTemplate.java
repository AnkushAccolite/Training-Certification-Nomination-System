package com.nominationsystem.tracers.models;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CourseReportTemplate {

    private String courseId;
    private String courseName;
    private String category;
    private List<CourseReportEmployeeDetails> monthlyDetails;

}
