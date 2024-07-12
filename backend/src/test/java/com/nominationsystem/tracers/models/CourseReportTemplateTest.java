package com.nominationsystem.tracers.models;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;

public class CourseReportTemplateTest {

    @Test
    public void testGettersAndSetters() {
        // Given
        CourseReportTemplate courseReportTemplate = new CourseReportTemplate();
        String courseId = "course1";
        String courseName = "Java Basics";
        String domain = "Programming";

        List<CourseReportEmployeeDetails> monthlyDetails = new ArrayList<>();
        CourseReportEmployeeDetails detail1 = new CourseReportEmployeeDetails();
        detail1.setEmployeesEnrolled(10);
        detail1.setEmployeesCompleted(8);
        detail1.setAttendance("80%");
        detail1.setMonth(java.time.Month.JANUARY);

        CourseReportEmployeeDetails detail2 = new CourseReportEmployeeDetails();
        detail2.setEmployeesEnrolled(15);
        detail2.setEmployeesCompleted(12);
        detail2.setAttendance("80%");
        detail2.setMonth(java.time.Month.FEBRUARY);

        monthlyDetails.add(detail1);
        monthlyDetails.add(detail2);

        // When
        courseReportTemplate.setCourseId(courseId);
        courseReportTemplate.setCourseName(courseName);
        courseReportTemplate.setDomain(domain);
        courseReportTemplate.setMonthlyDetails(monthlyDetails);

        // Then
        assertThat(courseReportTemplate.getCourseId()).isEqualTo(courseId);
        assertThat(courseReportTemplate.getCourseName()).isEqualTo(courseName);
        assertThat(courseReportTemplate.getDomain()).isEqualTo(domain);
        assertThat(courseReportTemplate.getMonthlyDetails()).isEqualTo(monthlyDetails);
    }
}
