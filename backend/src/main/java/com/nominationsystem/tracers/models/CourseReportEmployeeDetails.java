package com.nominationsystem.tracers.models;

import lombok.Getter;
import lombok.Setter;

import java.time.Month;

@Getter
@Setter
public class CourseReportEmployeeDetails {

    private Integer employeesEnrolled;
    private Integer employeesCompleted;
    private String attendance;
    private Month month;

}
