package com.nominationsystem.tracers.models;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
public class EmployeeReportTemplate {

    private String empId;

    private String empName;

    private ArrayList<EmployeeReportCourseDetails> completedCourses;

}
