package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.*;
import com.nominationsystem.tracers.repository.CertificationFeedbackRepository;
import com.nominationsystem.tracers.repository.CertificationRepository;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
    private EmailService emailService;

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
                .map(cert -> Objects.requireNonNull(this.certificationRepository.findById(cert).orElse(null))
                        .getName())
                .collect(Collectors.joining("\n\t"));
        Employee manager = this.employeeService.getEmployee(employee.getManagerId());
        String body = this.emailService.createPendingRequestEmailBody(manager.getEmpName(), empId,
                employee.getEmpName(), certificationList, "Certifications");

        this.emailService.sendEmail(manager.getEmail(), "Approval request for nomination", body);

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
        this.emailService.sendEmail(employee.getEmail(), "Nomination request approved", acceptedBody);

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

    public void cancelNomination(String empId, String certificationId) {
        Employee employee = this.employeeService.getEmployeeRepository().findByEmpId(empId);

        ArrayList<String> temp = employee.getPendingCertifications();
        temp.remove(certificationId);
        employee.setPendingCertifications(temp);

        String certificationName = Objects.requireNonNull(this.certificationRepository.findById(certificationId)
                .orElse(null)).getName();
        String rejectedBody = this.emailService.createRejectionEmailBody(employee.getEmpName(),
                certificationName, "Certification");
        this.emailService.sendEmail(employee.getEmail(), "Nomination request rejected", rejectedBody);

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

}
