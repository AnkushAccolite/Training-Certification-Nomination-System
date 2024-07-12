package com.nominationsystem.tracers.models;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class EmployeeCertificationTest {

    @Test
    public void testNoArgsConstructor() {
        // Given
        EmployeeCertification employeeCertification = new EmployeeCertification();

        // Then
        assertThat(employeeCertification).isNotNull();
        assertThat(employeeCertification.getPendingCertifications()).isNull();
        assertThat(employeeCertification.getCertifications()).isNull();
    }

    @Test
    public void testAllArgsConstructor() {
        // Given
        ArrayList<String> pendingCertifications = new ArrayList<>(List.of("cert1", "cert2"));
        ArrayList<CertificationStatus> certifications = new ArrayList<>(List.of(
                new CertificationStatus("cert1", "Completed"),
                new CertificationStatus("cert2", "In Progress")
        ));

        // When
        EmployeeCertification employeeCertification = new EmployeeCertification(pendingCertifications, certifications);

        // Then
        assertThat(employeeCertification).isNotNull();
        assertThat(employeeCertification.getPendingCertifications()).isEqualTo(pendingCertifications);
        assertThat(employeeCertification.getCertifications()).isEqualTo(certifications);
    }

    @Test
    public void testGettersAndSetters() {
        // Given
        EmployeeCertification employeeCertification = new EmployeeCertification();

        ArrayList<String> pendingCertifications = new ArrayList<>(List.of("cert1", "cert2"));
        ArrayList<CertificationStatus> certifications = new ArrayList<>(List.of(
                new CertificationStatus("cert1", "Completed"),
                new CertificationStatus("cert2", "In Progress")
        ));

        // When
        employeeCertification.setPendingCertifications(pendingCertifications);
        employeeCertification.setCertifications(certifications);

        // Then
        assertThat(employeeCertification.getPendingCertifications()).isEqualTo(pendingCertifications);
        assertThat(employeeCertification.getCertifications()).isEqualTo(certifications);
    }
}
