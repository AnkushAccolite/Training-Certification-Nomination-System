package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.*;
import com.nominationsystem.tracers.repository.CertificationFeedbackRepository;
import com.nominationsystem.tracers.repository.CertificationRepository;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;

@Service
public class CertificationService {

    @Autowired
    private CertificationRepository certificationRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private CertificationFeedbackRepository certificationFeedbackRepository;

    LocalDate currentDate = LocalDate.now();
    Month currentMonth = currentDate.getMonth();

    public void deleteCertification(String certificationId) {
        Optional<Certification> certification = this.certificationRepository.findById(certificationId);
        certification.ifPresent(cert -> cert.setIsDeleted(true));
        this.certificationRepository.save(certification.get());
    }

    public EmployeeCertification getEmployeeCertification(String empId) {
        Employee employee = this.employeeRepository.findByEmpId(empId);
        return new EmployeeCertification(employee.getPendingCertifications(), employee.getCertifications());
    }

    public void nominateCertification(String empId, ArrayList<String> certificationId) {
        Employee employee = this.employeeRepository.findByEmpId(empId);

        ArrayList<String> pendingCertifications = employee.getPendingCertifications();
        pendingCertifications.addAll(certificationId);
        employee.setPendingCertifications(pendingCertifications);
        this.employeeRepository.save(employee);
    }

    public ResponseEntity<?> approveCertification(String empId, String certificationId) {
        Employee employee = this.employeeRepository.findByEmpId(empId);

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
            certifications.add(new CertificationStatus(certificationId, currentDate, null, "inProgress", 1, null));
        }

        employee.setCertifications(certifications);

        ArrayList<String> pendingCerfications = employee.getPendingCertifications();

        pendingCerfications.remove(certificationId);

        employee.setPendingCertifications(pendingCerfications);

        this.employeeRepository.save(employee);
        return ResponseEntity.ok().build();
    }

    public void certificationCompleted(String empId, String certificationId,
            CertificationFeedback certificationFeedback) {
        this.certificationFeedbackRepository.save(certificationFeedback);
        Employee employee = this.employeeRepository.findByEmpId(empId);

        ArrayList<CertificationStatus> certifications = employee.getCertifications();

        certifications.forEach(x -> {
            if (Objects.equals(x.getCertificationId(), certificationId)) {
                x.setCompletionDate(new SimpleDateFormat("dd-MM-yyyy").format(new Date()));
                x.setStatus("completed");
                x.setUploadedCertificate(url);
            }
        });

        employee.setCertifications(certifications);
        this.employeeRepository.save(employee);
    }

    public void certificationFailed(String empId, String certificationId) {
        Employee employee = this.employeeRepository.findByEmpId(empId);

        ArrayList<CertificationStatus> certifications = employee.getCertifications();

        certifications.forEach(x -> {
            if (Objects.equals(x.getCertificationId(), certificationId)) {
                x.setStatus("failed");
            }
        });

        employee.setCertifications(certifications);
        this.employeeRepository.save(employee);
    }

    public void cancelNomination(String empId, String certificationId) {
        Employee employee = this.employeeRepository.findByEmpId(empId);

        ArrayList<String> temp = employee.getPendingCertifications();
        temp.remove(certificationId);
        employee.setPendingCertifications(temp);
        this.employeeRepository.save(employee);
    }

    public List<CertificationReportTemplate> getCertificationReport() {
        List<Employee> employees = this.employeeRepository.findAllByOrderByEmpIdAsc();
        List<CertificationReportTemplate> certificationReport = new ArrayList<>();

        employees.forEach(employee -> {
            CertificationReportTemplate report = new CertificationReportTemplate();
            List<String> certNames = new ArrayList<>();
            List<String> categories = new ArrayList<>();
            List<String> completionDates = new ArrayList<>();

            employee.getCertifications().stream()
                    .filter(cert -> cert.getStatus().equals("completed"))
                    .forEach(cert -> {
                        Certification certification = certificationRepository.findById(cert.getCertificationId())
                                .orElse(null);
                        if (certification != null) {
                            certNames.add(certification.getName());
                            categories.add(certification.getCategory());
                            completionDates.add(cert.getCompletionDate());
                        }
                    });
            if (!certNames.isEmpty()) {
                report.setEmpId(employee.getEmpId());
                report.setEmpName(employee.getEmpName());
                report.setCertName(certNames);
                report.setCategory(categories);
                report.setCompletionDate(completionDates);

                certificationReport.add(report);
            }
        });

        return certificationReport;
    }
}
