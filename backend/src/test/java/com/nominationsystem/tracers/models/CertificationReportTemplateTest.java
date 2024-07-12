package com.nominationsystem.tracers.models;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class CertificationReportTemplateTest {

    @Test
    public void testGettersAndSetters() {
        // Given
        CertificationReportTemplate certificationReportTemplate = new CertificationReportTemplate();

        String empId = "emp1";
        String empName = "John Doe";
        List<String> certNames = Arrays.asList("Cert1", "Cert2");
        List<String> domains = Arrays.asList("Domain1", "Domain2");
        List<String> completionDates = Arrays.asList("01-01-2023", "01-02-2023");

        // When
        certificationReportTemplate.setEmpId(empId);
        certificationReportTemplate.setEmpName(empName);
        certificationReportTemplate.setCertName(certNames);
        certificationReportTemplate.setDomain(domains);
        certificationReportTemplate.setCompletionDate(completionDates);

        // Then
        assertThat(certificationReportTemplate.getEmpId()).isEqualTo(empId);
        assertThat(certificationReportTemplate.getEmpName()).isEqualTo(empName);
        assertThat(certificationReportTemplate.getCertName()).isEqualTo(certNames);
        assertThat(certificationReportTemplate.getDomain()).isEqualTo(domains);
        assertThat(certificationReportTemplate.getCompletionDate()).isEqualTo(completionDates);
    }
}
