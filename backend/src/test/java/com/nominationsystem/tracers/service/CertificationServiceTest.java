package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.*;
import com.nominationsystem.tracers.repository.CertificationFeedbackRepository;
import com.nominationsystem.tracers.repository.CertificationRepository;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CertificationServiceTest {

    @Mock
    private CertificationRepository certificationRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private CertificationFeedbackRepository certificationFeedbackRepository;

    @InjectMocks
    private CertificationService certificationService;

    private Certification certification;
    private Employee employee;
    private CertificationFeedback certificationFeedback;

    @BeforeEach
    public void setUp() {
        certification = new Certification();
        certification.setId("cert1");
        certification.setName("Java Certification");

        employee = new Employee();
        employee.setEmpId("emp1");
        employee.setPendingCertifications(new ArrayList<>());
        employee.setCertifications(new ArrayList<>());

        certificationFeedback = new CertificationFeedback();
        certificationFeedback.setId("feedback1");
        certificationFeedback.setFeedback("Good job!");
    }

//    @Test
//    public void testDeleteCertification() {
//        when(certificationRepository.findById(anyString())).thenReturn(Optional.of(certification));
//        when(certificationRepository.save(any(Certification.class))).thenReturn(certification);
//
//        certificationService.deleteCertification("cert1");
//
//        verify(certificationRepository, times(1)).findById("cert1");
//        verify(certificationRepository, times(1)).save(certification);
//    }

    @Test
    public void testGetEmployeeCertification() {
        when(employeeRepository.findByEmpId(anyString())).thenReturn(employee);

        EmployeeCertification result = certificationService.getEmployeeCertification("emp1");

        assertEquals(employee.getPendingCertifications(), result.getPendingCertifications());
        assertEquals(employee.getCertifications(), result.getCertifications());
    }
}
