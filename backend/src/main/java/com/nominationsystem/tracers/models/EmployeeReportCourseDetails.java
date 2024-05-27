package com.nominationsystem.tracers.models;

import lombok.Getter;
import lombok.Setter;

import java.time.Month;

@Getter
@Setter
public class EmployeeReportCourseDetails {

    private String courseName;
    private String domain;
    private Month month;

}
