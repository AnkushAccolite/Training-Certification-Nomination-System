package com.nominationsystem.tracers.models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

public class CourseTest {

    private Course course;

    @BeforeEach
    public void setUp() {
        course = new Course();
    }

    @Test
    public void testNoArgsConstructor() throws ParseException {

        assertThat(course).isNotNull();
        assertThat(course.getCourseId()).isNull();
        assertThat(course.getCourseName()).isNull();
        assertThat(course.getDuration()).isNull();
        assertThat(course.getDomain()).isNull();
        assertThat(course.getDescription()).isNull();
        assertThat(course.getIsApprovalReq()).isNull();
        assertThat(course.getDelete()).isFalse();
        assertThat(course.getMonthlyStatus()).hasSize(12);
        assertThat(course.getPublishedDate()).isNotNull();
        assertDateFormat(course.getPublishedDate());
    }

    @Test
    public void testGettersAndSetters() {
        // Given
        String courseId = "course1";
        String courseName = "Java Programming";
        Integer duration = 30;
        String domain = "Programming";
        String description = "Learn Java programming basics.";
        Boolean isApprovalReq = true;

        // When
        course.setCourseId(courseId);
        course.setCourseName(courseName);
        course.setDuration(duration);
        course.setDomain(domain);
        course.setDescription(description);
        course.setIsApprovalReq(isApprovalReq);

        // Then
        assertThat(course.getCourseId()).isEqualTo(courseId);
        assertThat(course.getCourseName()).isEqualTo(courseName);
        assertThat(course.getDuration()).isEqualTo(duration);
        assertThat(course.getDomain()).isEqualTo(domain);
        assertThat(course.getDescription()).isEqualTo(description);
        assertThat(course.getIsApprovalReq()).isEqualTo(isApprovalReq);
    }

    private void assertDateFormat(String dateStr) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
        Date date = dateFormat.parse(dateStr);
        String formattedDate = dateFormat.format(date);

        assertThat(dateStr).isEqualTo(formattedDate);
    }
}
