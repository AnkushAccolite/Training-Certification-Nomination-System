package com.nominationsystem.tracers.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Month;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeCourseStatus {
    private String courseId;
    private Month month;

}
