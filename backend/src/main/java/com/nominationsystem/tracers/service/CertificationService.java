package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.*;
import com.nominationsystem.tracers.repository.CertificationFeedbackRepository;
import com.nominationsystem.tracers.repository.CertificationRepository;
import com.nominationsystem.tracers.repository.CustomCertificationRepositoryImpl;
import com.nominationsystem.tracers.repository.TCApprovalRecordsRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ua_parser.Client;
import ua_parser.Parser;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CertificationService {

    @Getter
    @Autowired
    private CertificationRepository certificationRepository;

    @Autowired
    @Lazy
    private EmployeeService employeeService;

    @Autowired
    private CertificationFeedbackRepository certificationFeedbackRepository;

    @Autowired
    private TCApprovalRecordsRepository tcApprovalRecordsRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private CustomCertificationRepositoryImpl customCertificationRepository;

    private final String baseUrl = "http://localhost:8080";

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return getIPv4Address(request.getRemoteAddr());
        }

        // X-Forwarded-For can contain multiple IP addresses, the first one is the
        // client's IP
        String[] ipAddresses = xfHeader.split(",");
        for (String ip : ipAddresses) {
            String ipv4 = getIPv4Address(ip.trim());
            if (ipv4 != null) {
                return ipv4;
            }
        }

        // Fall back to remote address if no valid IPv4 address found in X-Forwarded-For
        // header
        return getIPv4Address(request.getRemoteAddr());
    }

    private String getIPv4Address(String ipAddress) {
        if (ipAddress == null || ipAddress.isEmpty()) {
            return null;
        }
        if (ipAddress.contains(":")) {
            // If the address contains ":", it's an IPv6 address, return null
            return null;
        }
        return ipAddress;
    }

    public void getDeviceInfo(String userAgent, HttpServletRequest request, String empId,
            ArrayList<String> certificationId) {

        Parser uaParser = new Parser();
        Client client = uaParser.parse(userAgent);
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty()) {
            clientIp = request.getRemoteAddr();
        }

        TC_Approval_Records data = new TC_Approval_Records(empId, certificationId, client.os.family,
                client.device.family, client.os.major, client.userAgent.family, client.userAgent.major, clientIp);

        tcApprovalRecordsRepository.save(data);

    }

    public List<Certification> getAllCertifications() {
        List<Certification> temp = this.certificationRepository.findAll();

        List<Certification> filteredList = temp.stream()
                .filter(obj -> !obj.getIsDeleted())
                .collect(Collectors.toList());
        ;
        return filteredList;
    }

    public void deleteCertification(String certificationId) {
        Optional<Certification> certification = this.certificationRepository.findById(certificationId);
        certification.ifPresent(cert -> cert.setIsDeleted(true));
        this.certificationRepository.save(certification.get());
    }

    public EmployeeCertification getEmployeeCertification(String empId) {
        Employee employee = this.employeeService.getEmployeeRepository().findByEmpId(empId);
        return new EmployeeCertification(employee.getPendingCertifications(), employee.getCertifications());
    }

    public void nominateCertification(String empId, ArrayList<String> certificationId) {
        Employee employee = this.employeeService.getEmployeeRepository().findByEmpId(empId);

        ArrayList<String> pendingCertifications = employee.getPendingCertifications();
        pendingCertifications.addAll(certificationId);
        employee.setPendingCertifications(pendingCertifications);

        String certificationList = pendingCertifications.stream()
                .map(cert -> {
                    String certificationLine = "\t" + Objects.requireNonNull(this.certificationRepository.findById(cert)
                            .orElse(null)).getName();

                    String approveButton = String.format(
                            "<a href='%s/certifications/email/approveCertification?empId=%s&certificationId=%s' " +
                                    "style='background-color: green; color: white; padding: 10px; text-decoration: none; margin-right: 10px;'>Approve</a>",
                            baseUrl, empId, cert);

                    String rejectButton = String.format(
                            "<a href='%s/certifications/email/cancel?loggedInUser=%s&empId=%s&certificationId=%s' " +
                                    "style='background-color: red; color: white; padding: 10px; text-decoration: none;'>Reject</a></p>",
                            baseUrl, employee.getManagerId(), empId, cert);

                    certificationLine += "\t" + approveButton + rejectButton;
                    return certificationLine;
                })
                .collect(Collectors.joining("\n\n\n"));
        Employee manager = this.employeeService.getEmployee(employee.getManagerId());
        String body = this.emailService.createPendingRequestEmailBody(manager.getEmpName(), empId,
                employee.getEmpName(), certificationList, "Certifications");
        String subject = "Approval request for certification nomination from " + employee.getEmpName();

        this.emailService.sendEmailAsync(manager.getEmail(), subject, body);

        this.employeeService.getEmployeeRepository().save(employee);
    }

    public ResponseEntity<?> approveCertification(String empId, String certificationId) {
        Employee employee = this.employeeService.getEmployeeRepository().findByEmpId(empId);

        ArrayList<CertificationStatus> certifications = employee.getCertifications();

        String currentDate = new SimpleDateFormat("dd-MM-yyyy").format(new Date());

        if (employee.isCertificationPresent(certificationId)) {
            certifications.forEach(certification -> {
                if (certification.getCertificationId().equals(certificationId)) {
                    certification.setStatus("inProgress");
                    certification.setAttempt(certification.getAttempt() + 1);
                }
            });
        } else {
            certifications.add(new CertificationStatus(certificationId, currentDate, null,
                    "inProgress", 1, null));
        }

        employee.setCertifications(certifications);

        ArrayList<String> pendingCerfications = employee.getPendingCertifications();

        pendingCerfications.remove(certificationId);

        employee.setPendingCertifications(pendingCerfications);

        String certificationName = Objects.requireNonNull(this.certificationRepository.findById(certificationId)
                .orElse(null)).getName();
        String acceptedBody = this.emailService.createApprovalEmailBody(employee.getEmpName(),
                certificationName, "Certification");
        String subject = "Nomination request approved for certification " + certificationName;

        this.emailService.sendEmailAsync(employee.getEmail(), subject, acceptedBody);

        this.employeeService.getEmployeeRepository().save(employee);
        return ResponseEntity.ok().build();
    }

    public void certificationCompleted(String empId, String certificationId, String url,
            CertificationFeedback certificationFeedback) {
        this.certificationFeedbackRepository.save(certificationFeedback);
        Employee employee = this.employeeService.getEmployeeRepository().findByEmpId(empId);

        ArrayList<CertificationStatus> certifications = employee.getCertifications();

        certifications.forEach(x -> {
            if (Objects.equals(x.getCertificationId(), certificationId)) {
                x.setCompletionDate(new SimpleDateFormat("dd-MM-yyyy").format(new Date()));
                x.setStatus("completed");
                x.setUploadedCertificate(url);
            }
        });

        employee.setCertifications(certifications);
        this.employeeService.getEmployeeRepository().save(employee);
    }

    public void certificationFailed(String empId, String certificationId) {
        Employee employee = this.employeeService.getEmployeeRepository().findByEmpId(empId);

        ArrayList<CertificationStatus> certifications = employee.getCertifications();

        certifications.forEach(x -> {
            if (Objects.equals(x.getCertificationId(), certificationId)) {
                x.setStatus("failed");
            }
        });

        employee.setCertifications(certifications);
        this.employeeService.getEmployeeRepository().save(employee);
    }

    public void cancelNomination(String loggedInUser, String empId, String certificationId) {
        Employee employee = this.employeeService.getEmployeeRepository().findByEmpId(empId);

        ArrayList<String> temp = employee.getPendingCertifications();
        temp.remove(certificationId);
        employee.setPendingCertifications(temp);

        if (!loggedInUser.equals(empId)) {
            String certificationName = Objects.requireNonNull(this.certificationRepository.findById(certificationId)
                    .orElse(null)).getName();
            String rejectedBody = this.emailService.createRejectionEmailBody(employee.getEmpName(),
                    certificationName, "Certification");
            String subject = "Nomination request rejected for certification " + certificationName;

            this.emailService.sendEmailAsync(employee.getEmail(), subject, rejectedBody);
        }

        this.employeeService.getEmployeeRepository().save(employee);
    }

    public List<CertificationReportTemplate> getCertificationReport() {
        List<Employee> employees = this.employeeService.getEmployeeRepository().findAllByOrderByEmpIdAsc();
        List<CertificationReportTemplate> certificationReport = new ArrayList<>();

        employees.forEach(employee -> {
            CertificationReportTemplate report = new CertificationReportTemplate();
            List<String> certNames = new ArrayList<>();
            List<String> categories = new ArrayList<>();
            List<String> completionDates = new ArrayList<>();

            employee.getCertifications().stream()
                    .filter(cert -> cert.getStatus().equals("completed"))
                    .forEach(cert -> {
                        Certification certification = this.certificationRepository.findById(cert.getCertificationId())
                                .orElse(null);
                        if (certification != null) {
                            certNames.add(certification.getName());
                            categories.add(certification.getDomain());
                            completionDates.add(cert.getCompletionDate());
                        }
                    });
            if (!certNames.isEmpty()) {
                report.setEmpId(employee.getEmpId());
                report.setEmpName(employee.getEmpName());
                report.setCertName(certNames);
                report.setDomain(categories);
                report.setCompletionDate(completionDates);

                certificationReport.add(report);
            }
        });

        return certificationReport;
    }

    public List<String> fetchAllDomains() {
        return this.customCertificationRepository.findDistinctDomains();
    }

}
