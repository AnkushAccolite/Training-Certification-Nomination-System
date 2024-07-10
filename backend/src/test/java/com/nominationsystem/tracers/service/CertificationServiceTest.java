package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.*;
import com.nominationsystem.tracers.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import ua_parser.Client;
import ua_parser.Parser;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CertificationServiceTest {

    @Mock
    private CertificationRepository certificationRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private EmployeeService employeeService;

    @Mock
    private CertificationFeedbackRepository certificationFeedbackRepository;

    @Mock
    private TCApprovalRecordsRepository tcApprovalRecordsRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private CustomCertificationRepositoryImpl customCertificationRepository;

    @Mock
    private HttpServletRequest request;

    @Mock
    private Parser uaParser;

    @InjectMocks
    private CertificationService certificationService;

    private Certification certification;
    private Employee employee;
    private CertificationFeedback certificationFeedback;
    private Client client;
    private String userAgent;
    private String empId;
    private ArrayList<String> certificationId;

    @BeforeEach
    public void setUp() {
        certification = new Certification();
        certification.setCertificationId("cert1");
        certification.setName("Java Certification");

        employee = new Employee();
        employee.setEmpId("emp1");
        employee.setEmpName("Emp 1");
        employee.setPendingCertifications(new ArrayList<>());
        employee.setCertifications(new ArrayList<>());

        certificationFeedback = new CertificationFeedback();
        certificationFeedback.setCertificationId("feedback1");
        certificationFeedback.setComment("Good job!");

        userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
        client = uaParser.parse(userAgent);

        empId = "emp1";
        certificationId = new ArrayList<>();
        certificationId.add("cert1");
        certificationId.add("cert2");
    }

    @Test
    void testGetCertificationRepository() {
        assertEquals(certificationRepository, certificationService.getCertificationRepository());
    }

    @Test
    public void testGetClientIp_XForwardedForHeaderPresent() {
        String xfHeader = "192.168.0.1, 10.0.0.1";
        when(request.getHeader("X-Forwarded-For")).thenReturn(xfHeader);

        String result = certificationService.getClientIp(request);

        assertEquals("192.168.0.1", result);
    }

    @Test
    public void testGetClientIp_XForwardedForHeaderAbsent() {
        when(request.getHeader("X-Forwarded-For")).thenReturn(null);
        when(request.getRemoteAddr()).thenReturn("192.168.0.2");

        String result = certificationService.getClientIp(request);

        assertEquals("192.168.0.2", result);
    }

    @Test
    public void testGetClientIp_XForwardedForHeaderWithInvalidIPv4() {
        String xfHeader = "192.168.0.1";
        when(request.getHeader("X-Forwarded-For")).thenReturn(xfHeader);

        String result = certificationService.getClientIp(request);

        assertEquals("192.168.0.1", result);
    }

    @Test
    public void testGetClientIp_XForwardedForHeaderWithIPv6() {
        String xfHeader = "2001:0db8:85a3:0000:0000:8a2e:0370:7334, 192.168.0.1";
        when(request.getHeader("X-Forwarded-For")).thenReturn(xfHeader);

        String result = certificationService.getClientIp(request);

        assertEquals("192.168.0.1", result);
    }

    @Test
    public void testGetClientIp_XForwardedForHeaderWithOnlyIPv6() {
        String xfHeader = "2001:0db8:85a3:0000:0000:8a2e:0370:7334";
        when(request.getHeader("X-Forwarded-For")).thenReturn(xfHeader);
        when(request.getRemoteAddr()).thenReturn("192.168.0.2");

        String result = certificationService.getClientIp(request);

        assertEquals("192.168.0.2", result);
    }

    @Test
    public void testGetIPv4Address_NullInput() {
        String result = certificationService.getIPv4Address(null);
        assertNull(result);
    }

    @Test
    public void testGetIPv4Address_EmptyInput() {
        String result = certificationService.getIPv4Address("");
        assertNull(result);
    }

    @Test
    public void testGetIPv4Address_ValidIPv4() {
        String result = certificationService.getIPv4Address("192.168.0.1");
        assertEquals("192.168.0.1", result);
    }

    @Test
    public void testGetIPv4Address_ValidIPv4WithSpaces() {
        String result = certificationService.getIPv4Address(" 192.168.0.1 ");
        assertEquals(" 192.168.0.1 ", result);
    }

    @Test
    public void testGetIPv4Address_InvalidIPv4WithColon() {
        String result = certificationService.getIPv4Address("192.168:0.1");
        assertNull(result);
    }

    @Test
    public void testGetIPv4Address_ValidIPv6() {
        String result = certificationService.getIPv4Address("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
        assertNull(result);
    }

    @Test
    public void testGetIPv4Address_MixedIPv6() {
        String result = certificationService.getIPv4Address("::ffff:192.168.0.1");
        assertNull(result);
    }

    @Test
    public void testGetDeviceInfo_WithXForwardedForHeader() {
        when(request.getHeader("X-Forwarded-For")).thenReturn("192.168.0.1");

        certificationService.getDeviceInfo(userAgent, request, empId, certificationId);

        verify(tcApprovalRecordsRepository, times(1)).save(any(TC_Approval_Records.class));
    }

    @Test
    public void testGetDeviceInfo_WithoutXForwardedForHeader() {
        when(request.getHeader("X-Forwarded-For")).thenReturn(null);
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");

        certificationService.getDeviceInfo(userAgent, request, empId, certificationId);

        verify(tcApprovalRecordsRepository, times(1)).save(any(TC_Approval_Records.class));
    }

    @Test
    public void testGetDeviceInfo_EmptyXForwardedForHeader() {
        when(request.getHeader("X-Forwarded-For")).thenReturn("");
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");

        certificationService.getDeviceInfo(userAgent, request, empId, certificationId);

        verify(tcApprovalRecordsRepository, times(1)).save(any(TC_Approval_Records.class));
    }

    @Test
    public void testGetCertifications() {
        List<Certification> certifications = new ArrayList<>();
        certifications.add(certification);
        when(certificationRepository.findAll()).thenReturn(certifications);

        List<Certification> result = certificationService.getCertifications();
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("Java Certification", result.get(0).getName());
    }

    @Test
    public void testGetAllCertifications() {
        List<Certification> certifications = new ArrayList<>();
        certifications.add(certification);
        when(certificationRepository.findAll()).thenReturn(certifications);

        List<Certification> result = certificationService.getAllCertifications();
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("Java Certification", result.get(0).getName());
    }

    @Test
    public void testDeleteCertification() {
        when(certificationRepository.findById(anyString())).thenReturn(Optional.of(certification));
        certificationService.deleteCertification("cert1", "emp1");
        verify(certificationRepository, times(1)).findById("cert1");
        verify(certificationRepository, times(1)).save(certification);
        assertTrue(certification.getIsDeleted());
    }

    @Test
    public void testGetEmployeeCertification() {
        when(employeeService.getEmployeeRepository()).thenReturn(employeeRepository);
        when(employeeRepository.findByEmpId(anyString())).thenReturn(employee);

        EmployeeCertification result = certificationService.getEmployeeCertification("emp1");

        assertEquals(employee.getPendingCertifications(), result.getPendingCertifications());
        assertEquals(employee.getCertifications(), result.getCertifications());
    }

    @Test
    public void testNominateCertification() {
        Employee manager = new Employee();
        manager.setEmpId("emp12");
        manager.setEmpName("Emp 12");
        manager.setEmail("manager@accolitedigital.com");
        employee.setManagerId("emp12");

        when(employeeService.getEmployeeRepository()).thenReturn(employeeRepository);
        when(employeeRepository.findByEmpId(anyString())).thenReturn(employee);
        when(employeeService.getEmployee(anyString())).thenReturn(manager);
        when(certificationRepository.findById(anyString())).thenReturn(Optional.of(certification));
        when(emailService.createPendingRequestEmailBody(anyString(), anyString(), anyString(), anyString(), anyString())).thenReturn("body");
        doNothing().when(emailService).sendEmailAsync(anyString(), anyString(), anyString());

        ArrayList<String> certificationIds = new ArrayList<>();
        certificationIds.add("cert1");
        certificationService.nominateCertification("emp1", certificationIds);

        assertTrue(employee.getPendingCertifications().contains("cert1"));
        verify(emailService, times(1)).sendEmailAsync(anyString(), anyString(), anyString());
    }

    @Test
    public void testApproveCertification() {
        employee.setEmail("employee@accolitedigital.com");

        when(employeeService.getEmployeeRepository()).thenReturn(employeeRepository);
        when(employeeRepository.findByEmpId(anyString())).thenReturn(employee);
        when(certificationRepository.findById(anyString())).thenReturn(Optional.of(certification));
        when(emailService.createApprovalEmailBody(anyString(), anyString(), anyString())).thenReturn("body");
        doNothing().when(emailService).sendEmailAsync(anyString(), anyString(), anyString());

        ResponseEntity<?> response = certificationService.approveCertification("emp1", "cert1");

        assertEquals(ResponseEntity.ok().build(), response);
        assertTrue(employee.getCertifications().stream().anyMatch(c -> c.getCertificationId().equals("cert1")));
        assertFalse(employee.getPendingCertifications().contains("cert1"));
        verify(emailService, times(1)).sendEmailAsync(anyString(), anyString(), anyString());
    }

    @Test
    public void testCertificationCompleted() {
        CertificationStatus certificationStatus = new CertificationStatus();
        certificationStatus.setCertificationId(certification.getCertificationId());
        certificationStatus.setStatus("inProgress");
        employee.getCertifications().add(certificationStatus);

        when(employeeService.getEmployeeRepository()).thenReturn(employeeRepository);
        when(employeeRepository.findByEmpId(anyString())).thenReturn(employee);
        certificationService.certificationCompleted("emp1", "cert1", "url", certificationFeedback);

        assertTrue(employee.getCertifications().stream()
                .anyMatch(c -> c.getCertificationId().equals("cert1") && c.getStatus().equals("completed")));
        verify(certificationFeedbackRepository, times(1)).save(certificationFeedback);
    }

    @Test
    public void testCertificationFailed() {
        CertificationStatus certificationStatus = new CertificationStatus();
        certificationStatus.setCertificationId(certification.getCertificationId());
        certificationStatus.setStatus("inProgress");
        employee.getCertifications().add(certificationStatus);

        when(employeeService.getEmployeeRepository()).thenReturn(employeeRepository);
        when(employeeRepository.findByEmpId(anyString())).thenReturn(employee);
        certificationService.certificationFailed("emp1", "cert1");

        assertTrue(employee.getCertifications().stream()
                .anyMatch(c -> c.getCertificationId().equals("cert1") && c.getStatus().equals("failed")));
    }

    @Test
    public void testCancelNomination() {
        when(employeeService.getEmployeeRepository()).thenReturn(employeeRepository);
        when(employeeRepository.findByEmpId(anyString())).thenReturn(employee);
        when(certificationRepository.findById(anyString())).thenReturn(Optional.ofNullable(certification));
        employee.getPendingCertifications().add("cert1");
        certificationService.cancelNomination("loggedInUser", "emp1", "cert1");

        assertFalse(employee.getPendingCertifications().contains("cert1"));
    }

    @Test
    public void testGetCertificationReport() {
        List<Employee> employees = new ArrayList<>();
        CertificationStatus certificationStatus = new CertificationStatus();
        certificationStatus.setCertificationId(certification.getCertificationId());
        certificationStatus.setStatus("completed");
        employee.getCertifications().add(certificationStatus);
        employees.add(employee);

        when(employeeService.getEmployeeRepository()).thenReturn(employeeRepository);
        when(employeeRepository.findAllByOrderByEmpIdAsc()).thenReturn(employees);
        when(certificationRepository.findById(anyString())).thenReturn(Optional.of(certification));

        List<CertificationReportTemplate> report = certificationService.getCertificationReport();

        assertFalse(report.isEmpty());
    }

    @Test
    public void testFetchAllDomains() {
        List<String> domains = Arrays.asList("Domain1", "Domain2");
        when(customCertificationRepository.findDistinctDomains()).thenReturn(domains);

        List<String> result = certificationService.fetchAllDomains();

        assertEquals(domains, result);
    }
}
