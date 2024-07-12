package com.nominationsystem.tracers.models;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class CertificationTest {

    @Test
    public void testCertificationSetterGetter() {
        // Given
        Certification certification = new Certification();
        String certificationId = "cert2";
        String name = "Certified Kubernetes Administrator";
        Integer duration = 60;
        String domain = "Container Orchestration";
        String description = "Certification for Kubernetes Administrators";
        Boolean isDeleted = true;

        // When
        certification.setCertificationId(certificationId);
        certification.setName(name);
        certification.setDuration(duration);
        certification.setDomain(domain);
        certification.setDescription(description);
        certification.setIsDeleted(isDeleted);

        // Then
        assertThat(certification.getCertificationId()).isEqualTo(certificationId);
        assertThat(certification.getName()).isEqualTo(name);
        assertThat(certification.getDuration()).isEqualTo(duration);
        assertThat(certification.getDomain()).isEqualTo(domain);
        assertThat(certification.getDescription()).isEqualTo(description);
        assertThat(certification.getIsDeleted()).isEqualTo(isDeleted);
    }
}
