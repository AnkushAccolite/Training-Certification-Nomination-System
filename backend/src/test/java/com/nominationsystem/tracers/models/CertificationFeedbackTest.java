package com.nominationsystem.tracers.models;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class CertificationFeedbackTest {

    @Test
    public void testGettersAndSetters() {
        // Given
        CertificationFeedback certificationFeedback = new CertificationFeedback();

        String feedbackId = "1";
        String empId = "emp1";
        String empName = "John Doe";
        String certificationId = "cert1";
        int rating = 5;
        String comment = "Excellent certification course.";

        // When
        certificationFeedback.setFeedbackId(feedbackId);
        certificationFeedback.setEmpId(empId);
        certificationFeedback.setEmpName(empName);
        certificationFeedback.setCertificationId(certificationId);
        certificationFeedback.setRating(rating);
        certificationFeedback.setComment(comment);

        // Then
        assertThat(certificationFeedback.getFeedbackId()).isEqualTo(feedbackId);
        assertThat(certificationFeedback.getEmpId()).isEqualTo(empId);
        assertThat(certificationFeedback.getEmpName()).isEqualTo(empName);
        assertThat(certificationFeedback.getCertificationId()).isEqualTo(certificationId);
        assertThat(certificationFeedback.getRating()).isEqualTo(rating);
        assertThat(certificationFeedback.getComment()).isEqualTo(comment);
    }
}
