package com.nominationsystem.tracers.models;

import org.junit.jupiter.api.Test;

import java.time.Month;

import static org.assertj.core.api.Assertions.assertThat;

public class CourseReportEmployeeDetailsTest {

    @Test
    public void testGettersAndSetters() {
        // Given
        CourseReportEmployeeDetails details = new CourseReportEmployeeDetails();
        Integer employeesEnrolled = 100;
        Integer employeesCompleted = 75;
        String attendance = "75%";
        Month month = Month.JANUARY;

        // When
        details.setEmployeesEnrolled(employeesEnrolled);
        details.setEmployeesCompleted(employeesCompleted);
        details.setAttendance(attendance);
        details.setMonth(month);

        // Then
        assertThat(details.getEmployeesEnrolled()).isEqualTo(employeesEnrolled);
        assertThat(details.getEmployeesCompleted()).isEqualTo(employeesCompleted);
        assertThat(details.getAttendance()).isEqualTo(attendance);
        assertThat(details.getMonth()).isEqualTo(month);
    }
}
