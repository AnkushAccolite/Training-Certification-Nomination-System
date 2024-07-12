package com.nominationsystem.tracers.models;

import org.junit.jupiter.api.Test;

import java.text.SimpleDateFormat;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

public class CertificationStatusTest {

    @Test
    public void testNoArgsConstructor() {
        // Given
        CertificationStatus certificationStatus = new CertificationStatus();

        // Then
        assertThat(certificationStatus).isNotNull();
        assertThat(certificationStatus.getCertificationId()).isNull();
        assertThat(certificationStatus.getStartDate()).isEqualTo(new SimpleDateFormat("dd-MM-yyyy").format(new Date()));
        assertThat(certificationStatus.getCompletionDate()).isNull();
        assertThat(certificationStatus.getStatus()).isNull();
        assertThat(certificationStatus.getAttempt()).isEqualTo(1);
        assertThat(certificationStatus.getUploadedCertificate()).isNull();
    }

    @Test
    public void testAllArgsConstructor() {
        // Given
        String certificationId = "cert1";
        String startDate = new SimpleDateFormat("dd-MM-yyyy").format(new Date());
        String completionDate = "01-01-2023";
        String status = "Completed";
        int attempt = 2;
        String uploadedCertificate = "cert.pdf";

        // When
        CertificationStatus certificationStatus = new CertificationStatus(certificationId, startDate, completionDate, status, attempt, uploadedCertificate);

        // Then
        assertThat(certificationStatus).isNotNull();
        assertThat(certificationStatus.getCertificationId()).isEqualTo(certificationId);
        assertThat(certificationStatus.getStartDate()).isEqualTo(startDate);
        assertThat(certificationStatus.getCompletionDate()).isEqualTo(completionDate);
        assertThat(certificationStatus.getStatus()).isEqualTo(status);
        assertThat(certificationStatus.getAttempt()).isEqualTo(attempt);
        assertThat(certificationStatus.getUploadedCertificate()).isEqualTo(uploadedCertificate);
    }

    @Test
    public void testPartialArgsConstructor() {
        // Given
        String certificationId = "cert1";
        String status = "In Progress";

        // When
        CertificationStatus certificationStatus = new CertificationStatus(certificationId, status);

        // Then
        assertThat(certificationStatus).isNotNull();
        assertThat(certificationStatus.getCertificationId()).isEqualTo(certificationId);
        assertThat(certificationStatus.getStatus()).isEqualTo(status);
        assertThat(certificationStatus.getStartDate()).isEqualTo(new SimpleDateFormat("dd-MM-yyyy").format(new Date()));
        assertThat(certificationStatus.getCompletionDate()).isNull();
        assertThat(certificationStatus.getAttempt()).isEqualTo(1);
        assertThat(certificationStatus.getUploadedCertificate()).isNull();
    }

    @Test
    public void testGettersAndSetters() {
        // Given
        CertificationStatus certificationStatus = new CertificationStatus();

        String certificationId = "cert1";
        String startDate = new SimpleDateFormat("dd-MM-yyyy").format(new Date());
        String completionDate = "01-01-2023";
        String status = "Completed";
        int attempt = 2;
        String uploadedCertificate = "cert.pdf";

        // When
        certificationStatus.setCertificationId(certificationId);
        certificationStatus.setStartDate(startDate);
        certificationStatus.setCompletionDate(completionDate);
        certificationStatus.setStatus(status);
        certificationStatus.setAttempt(attempt);
        certificationStatus.setUploadedCertificate(uploadedCertificate);

        // Then
        assertThat(certificationStatus.getCertificationId()).isEqualTo(certificationId);
        assertThat(certificationStatus.getStartDate()).isEqualTo(startDate);
        assertThat(certificationStatus.getCompletionDate()).isEqualTo(completionDate);
        assertThat(certificationStatus.getStatus()).isEqualTo(status);
        assertThat(certificationStatus.getAttempt()).isEqualTo(attempt);
        assertThat(certificationStatus.getUploadedCertificate()).isEqualTo(uploadedCertificate);
    }
}
