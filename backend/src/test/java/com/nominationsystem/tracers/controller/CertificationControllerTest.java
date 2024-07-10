package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.Certification;
import com.nominationsystem.tracers.models.CertificationFeedback;
import com.nominationsystem.tracers.models.CertificationReportTemplate;
import com.nominationsystem.tracers.models.EmployeeCertification;
import com.nominationsystem.tracers.repository.CertificationRepository;
import com.nominationsystem.tracers.service.CertificationService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
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
    public void testGetCertifications() {
        List<Certification> certifications = new ArrayList<>();
        certifications.add(certification);

        when(certificationService.getCertifications()).thenReturn(certifications);

        ResponseEntity<?> response = certificationController.getCertifications();

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testGetAllCertifications() {
        List<Certification> certifications = new ArrayList<>();
        certifications.add(certification);

        when(certificationService.getAllCertifications()).thenReturn(certifications);

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
        doNothing().when(certificationService).deleteCertification(anyString(), anyString());

        certificationController.deleteCertification("cert1", "emp1");

        verify(certificationService, times(1)).deleteCertification("cert1", "emp1");
    }

    @Test
    public void testNominateCertification() {
        doNothing().when(certificationService).nominateCertification(anyString(), any());

        ArrayList<String> certificationIds = new ArrayList<>();
        certificationIds.add("cert1");
        certificationController.nominateCertification("emp1", certificationIds);

        verify(certificationService, times(1)).nominateCertification("emp1", certificationIds);
    }

    @Test
    public void testAssignCertification() {
        when(certificationService.approveCertification(anyString(), anyString()))
                .thenReturn(new ResponseEntity<>(HttpStatus.OK));

        ResponseEntity<?> response = certificationController.assignCertification("emp1", "cert1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testCompleteCourse() {
        doNothing().when(certificationService).certificationCompleted(anyString(), anyString(), anyString(),
                any(CertificationFeedback.class));

        CertificationFeedback feedback = new CertificationFeedback();
        certificationController.completeCourse("emp1", "cert1", "https://test.com", feedback);

        verify(certificationService, times(1)).certificationCompleted("emp1", "cert1", "https://test.com", feedback);
    }

    @Test
    public void testCourseFailed() {
        doNothing().when(certificationService).certificationFailed(anyString(), anyString());

        certificationController.courseFailed("emp1", "cert1");

        verify(certificationService, times(1)).certificationFailed("emp1", "cert1");
    }

    @Test
    public void testCancelNomination() {
        doNothing().when(certificationService).cancelNomination(anyString(), anyString(), anyString());

        certificationController.cancelNomination("loggedInUser", "emp1", "cert1");

        verify(certificationService, times(1)).cancelNomination("loggedInUser", "emp1", "cert1");
    }

    @Test
    public void testGetCertificationReport() {
        List<CertificationReportTemplate> mockReport = new ArrayList<>();
        // Mock the service method
        when(certificationService.getCertificationReport()).thenReturn(mockReport);

        // Call the controller method
        List<CertificationReportTemplate> result = certificationController.getCertificationReport();

        // Assert the result
        assertEquals(mockReport, result);
        verify(certificationService, times(1)).getCertificationReport();
    }

    @Test
    public void testGetDeviceInfo() {
        String userAgent = "Test User-Agent";
        String empId = "emp1";
        ArrayList<String> certificationIds = new ArrayList<>();
        certificationIds.add("cert1");

        // Mock the service method with matchers for all arguments
        doNothing().when(certificationService).getDeviceInfo(eq(userAgent), any(HttpServletRequest.class), eq(empId), eq(certificationIds));

        // Call the controller method
        certificationController.getDeviceInfo(userAgent, mock(HttpServletRequest.class), empId, certificationIds);

        // Verify the service method is called with the correct parameters using matchers
        verify(certificationService, times(1)).getDeviceInfo(eq(userAgent), any(HttpServletRequest.class), eq(empId), eq(certificationIds));
    }

    @Test
    public void testAssignCertificationFromEmail() {
        String empId = "emp1";
        String certificationId = "cert1";

        // Mock the service method
        when(certificationService.approveCertification(empId, certificationId)).thenReturn(ResponseEntity.ok().build());

        // Call the controller method
        String result = certificationController.assignCertificationFromEmail(empId, certificationId);

        // Verify the service method is called
        verify(certificationService, times(1)).approveCertification(empId, certificationId);

        // Additional assertions on HTML content can be added if necessary
        assertNotNull(result);
    }

    @Test
    public void testCancelNominationFromEmail() {
        String loggedInUser = "admin";
        String empId = "emp1";
        String certificationId = "cert1";

        // Mock the service method
        doNothing().when(certificationService).cancelNomination(loggedInUser, empId, certificationId);

        // Call the controller method
        String result = certificationController.cancelNominationFromEmail(loggedInUser, empId, certificationId);

        // Verify the service method is called
        verify(certificationService, times(1)).cancelNomination(loggedInUser, empId, certificationId);

        // Additional assertions on HTML content can be added if necessary
        assertNotNull(result);
    }

    @Test
    public void testFetchAllCategories() {
        List<String> mockCategories = Arrays.asList("Category1", "Category2");

        // Mock the service method
        when(certificationService.fetchAllDomains()).thenReturn(mockCategories);

        // Call the controller method
        List<String> result = certificationController.fetchAllCategories();

        // Assert the result
        assertEquals(mockCategories, result);
        verify(certificationService, times(1)).fetchAllDomains();
    }

}
