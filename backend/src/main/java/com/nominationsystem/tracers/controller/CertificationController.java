package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.*;
import com.nominationsystem.tracers.repository.CertificationRepository;
import com.nominationsystem.tracers.service.CertificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/certifications")
public class CertificationController {

    @Autowired
    private CertificationRepository certificationRepository;

    @Autowired
    private CertificationService certificationService;


    @GetMapping
    public ResponseEntity<?> getAllCertifications() {
        return ResponseEntity.ok(this.certificationRepository.findAll());
    }

    @PostMapping
    public Certification addCertification(@RequestBody Certification certification) {
        return this.certificationRepository.save(certification);
    }

    @GetMapping("/employee/{empId}")
    public EmployeeCertification getEmployeeCertifications(@PathVariable("empId") String empId) {
        return this.certificationService.getEmployeeCertification(empId);
    }

    @PatchMapping("/{certificationId}")
    public void deleteCertification(@PathVariable("certificationId") String certificationId) {
        this.certificationService.deleteCertification(certificationId);
    }

    @PostMapping("/nominateCertification")
    public void nominateCertification(@RequestParam String empId, @RequestBody ArrayList<String> certificationId) {
        this.certificationService.nominateCertification(empId, certificationId);
    }

    @GetMapping("/approveCertification")
    public ResponseEntity<?> assignCertification(@RequestParam String empId, @RequestParam String certificationId) {
        return this.certificationService.approveCertification(empId, certificationId);
    }

    @PostMapping("/completed")
    public void completeCourse(@RequestParam String empId, @RequestParam String certificationId, @RequestParam String url,
                               @RequestBody CertificationFeedback certificationFeedback) {
        this.certificationService.certificationCompleted(empId, certificationId, url, certificationFeedback);
    }

    @GetMapping("/failed")
    public void courseFailed(@RequestParam String empId, @RequestParam String certificationId) {
        this.certificationService.certificationFailed(empId, certificationId);
    }

    @GetMapping("/cancel")
    public void cancelNomination(@RequestParam String empId, @RequestParam String certificationId) {
        this.certificationService.cancelNomination(empId, certificationId);
    }

    @GetMapping("/certificationReport")
    public List<CertificationReportTemplate> getCertificationReport() {
        return this.certificationService.getCertificationReport();
    }
}
