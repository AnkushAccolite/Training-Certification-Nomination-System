package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.Certification;
import com.nominationsystem.tracers.models.CertificationFeedback;
import com.nominationsystem.tracers.models.EmployeeCertification;
import com.nominationsystem.tracers.repository.CertificationRepository;
import com.nominationsystem.tracers.service.CertificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CertificationControllerTest {

    @Mock
    private CertificationRepository certificationRepository;

    @Mock
    private CertificationService certificationService;

    @InjectMocks
    private CertificationController certificationController;

    private Certification certification;

    @BeforeEach
    public void setUp() {
        certification = new Certification();
        certification.setId("cert1");
        certification.setName("Java Certification");
    }

    @Test
    public void testGetAllCertifications() {
        List<Certification> certifications = new ArrayList<>();
        certifications.add(certification);

        when(certificationRepository.findAll()).thenReturn(certifications);

        ResponseEntity<?> response = certificationController.getAllCertifications();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(certifications, response.getBody());
    }

    @Test
    public void testAddCertification() {
        when(certificationRepository.save(any(Certification.class))).thenReturn(certification);

        Certification response = certificationController.addCertification(certification);

        assertEquals(certification, response);
    }

    @Test
    public void testGetEmployeeCertifications() {
        EmployeeCertification employeeCertification = new EmployeeCertification();
        when(certificationService.getEmployeeCertification(anyString())).thenReturn(employeeCertification);

        EmployeeCertification response = certificationController.getEmployeeCertifications("emp1");

        assertEquals(employeeCertification, response);
    }

    @Test
    public void testDeleteCertification() {
        doNothing().when(certificationService).deleteCertification(anyString());

        certificationController.deleteCertification("cert1");

        verify(certificationService, times(1)).deleteCertification("cert1");
    }

//    @Test
//    public void testNominateCertification() {
//        ArrayList<String> dummyList = new ArrayList<>();
//        doNothing().when(certificationService).nominateCertification(anyString(), dummyList);
//
//        ArrayList<String> certificationIds = new ArrayList<>();
//        certificationIds.add("cert1");
//        certificationController.nominateCertification("emp1", certificationIds);
//
//        verify(certificationService, times(1)).nominateCertification("emp1", certificationIds);
//    }

    @Test
    public void testAssignCertification() {
        when(certificationService.approveCertification(anyString(), anyString())).thenReturn(new ResponseEntity<>(HttpStatus.OK));

        ResponseEntity<?> response = certificationController.assignCertification("emp1", "cert1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testCompleteCourse() {
        doNothing().when(certificationService).certificationCompleted(anyString(), anyString(),anyString(), any(CertificationFeedback.class));

        CertificationFeedback feedback = new CertificationFeedback();
        certificationController.completeCourse("emp1", "cert1","https://test.com", feedback);

        verify(certificationService, times(1)).certificationCompleted("emp1", "cert1","https://test.com", feedback);
    }

    @Test
    public void testCourseFailed() {
        doNothing().when(certificationService).certificationFailed(anyString(), anyString());

        certificationController.courseFailed("emp1", "cert1");

        verify(certificationService, times(1)).certificationFailed("emp1", "cert1");
    }

    @Test
    public void testCancelNomination() {
        doNothing().when(certificationService).cancelNomination(anyString(), anyString());

        certificationController.cancelNomination("emp1", "cert1");

        verify(certificationService, times(1)).cancelNomination("emp1", "cert1");
    }
}

