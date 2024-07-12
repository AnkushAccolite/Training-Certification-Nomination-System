package com.nominationsystem.tracers.models;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class EmployeeCourseStatusTest {

    @Test
    public void testNoArgsConstructor() {
        // Given
        EmployeeCourseStatus status = new EmployeeCourseStatus();

        // Then
        assertThat(status).isNotNull();
        assertThat(status.getCourseId()).isNull();
        assertThat(status.getDate()).isNull();
    }

    @Test
    public void testAllArgsConstructor() {
        // Given
        String courseId = "course123";
        String date = "01-01-2024";

        // When
        EmployeeCourseStatus status = new EmployeeCourseStatus(courseId, date);

        // Then
        assertThat(status).isNotNull();
        assertThat(status.getCourseId()).isEqualTo(courseId);
        assertThat(status.getDate()).isEqualTo(date);
    }

    @Test
    public void testGettersAndSetters() {
        // Given
        EmployeeCourseStatus status = new EmployeeCourseStatus();
        String courseId = "course123";
        String date = "01-01-2024";

        // When
        status.setCourseId(courseId);
        status.setDate(date);

        // Then
        assertThat(status.getCourseId()).isEqualTo(courseId);
        assertThat(status.getDate()).isEqualTo(date);
    }
}
