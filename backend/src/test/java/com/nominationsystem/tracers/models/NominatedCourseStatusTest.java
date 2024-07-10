package com.nominationsystem.tracers.models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class NominatedCourseStatusTest {

    private NominatedCourseStatus nominatedCourseStatus;

    @BeforeEach
    public void setUp() {
        nominatedCourseStatus = new NominatedCourseStatus();
    }

    @Test
    public void testNoArgsConstructor() {
        assertThat(nominatedCourseStatus).isNotNull();
    }

    @Test
    public void testAllArgsConstructor() {
        // Given
        String courseId = "course1";
        String approvalStatus = "APPROVED";

        // When
        NominatedCourseStatus nominatedCourse = new NominatedCourseStatus(courseId, approvalStatus);

        // Then
        assertThat(nominatedCourse.getCourseId()).isEqualTo(courseId);
        assertThat(nominatedCourse.getApprovalStatus()).isEqualTo(ApprovalStatus.APPROVED);
    }

    @Test
    public void testGettersAndSetters() {
        // Given
        String courseId = "course1";
        String approvalStatus = "APPROVED";

        // When
        nominatedCourseStatus.setCourseId(courseId);
        nominatedCourseStatus.setApprovalStatus(ApprovalStatus.valueOf(approvalStatus));

        // Then
        assertThat(nominatedCourseStatus.getCourseId()).isEqualTo(courseId);
        assertThat(nominatedCourseStatus.getApprovalStatus()).isEqualTo(ApprovalStatus.APPROVED);
    }

    @Test
    public void testSetAndGetApprovalStatus() {
        // Given
        String approvalStatus = "APPROVED";

        // When
        nominatedCourseStatus.setApprovalStatus(ApprovalStatus.valueOf(approvalStatus));

        // Then
        assertThat(nominatedCourseStatus.getApprovalStatus()).isEqualTo(ApprovalStatus.APPROVED);
    }
}
