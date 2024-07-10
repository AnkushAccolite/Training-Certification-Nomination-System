package com.nominationsystem.tracers.models;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class CourseFeedbackTest {

    @Test
    public void testSettersAndGetters() {
        // Given
        CourseFeedback feedback = new CourseFeedback();
        String feedbackId = "feedback2";
        String empId = "emp2";
        String empName = "Jane Doe";
        String courseId = "course2";
        int rating = 5;
        String comment = "Excellent course!";

        // When
        feedback.setFeedbackId(feedbackId);
        feedback.setEmpId(empId);
        feedback.setEmpName(empName);
        feedback.setCourseId(courseId);
        feedback.setRating(rating);
        feedback.setComment(comment);

        // Then
        assertThat(feedback.getFeedbackId()).isEqualTo(feedbackId);
        assertThat(feedback.getEmpId()).isEqualTo(empId);
        assertThat(feedback.getEmpName()).isEqualTo(empName);
        assertThat(feedback.getCourseId()).isEqualTo(courseId);
        assertThat(feedback.getRating()).isEqualTo(rating);
        assertThat(feedback.getComment()).isEqualTo(comment);
    }
}
