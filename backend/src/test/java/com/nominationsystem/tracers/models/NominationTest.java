package com.nominationsystem.tracers.models;

import org.junit.jupiter.api.Test;

import java.text.SimpleDateFormat;
import java.time.Month;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class NominationTest {

    @Test
    public void testNominationInitialization() {
        // Given
        String nominationId = "nom1";
        String empName = "John Doe";
        String empId = "E123";
        String managerId = "M456";
        Month month = Month.JANUARY;
        List<NominatedCourseStatus> nominatedCourses = new ArrayList<>();
        List<String> certifId = new ArrayList<>();
        String nominationDate = new SimpleDateFormat("dd-MM-yyyy").format(new Date());
        String courseSuggestions = "Some suggestions";

        // When
        Nomination nomination = new Nomination();
        nomination.setNominationId(nominationId);
        nomination.setEmpName(empName);
        nomination.setEmpId(empId);
        nomination.setManagerId(managerId);
        nomination.setMonth(month);
        nomination.setNominatedCourses(nominatedCourses);
        nomination.setCertifId(certifId);
        nomination.setNominationDate(nominationDate);
        nomination.setCourseSuggestions(courseSuggestions);

        // Then
        assertThat(nomination.getNominationId()).isEqualTo(nominationId);
        assertThat(nomination.getEmpName()).isEqualTo(empName);
        assertThat(nomination.getEmpId()).isEqualTo(empId);
        assertThat(nomination.getManagerId()).isEqualTo(managerId);
        assertThat(nomination.getMonth()).isEqualTo(month);
        assertThat(nomination.getNominatedCourses()).isEqualTo(nominatedCourses);
        assertThat(nomination.getCertifId()).isEqualTo(certifId);
        assertThat(nomination.getNominationDate()).isEqualTo(nominationDate);
        assertThat(nomination.getCourseSuggestions()).isEqualTo(courseSuggestions);
    }
}
