package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.*;
import com.nominationsystem.tracers.repository.CertificationRepository;
import com.nominationsystem.tracers.service.CertificationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/certifications")
public class CertificationController {

    @Autowired
    private CertificationRepository certificationRepository;

    @Autowired
    private CertificationService certificationService;

    @GetMapping
    public ResponseEntity<?> getAllCertifications() {
        List<Certification> res = this.certificationService.getAllCertifications();
        return ResponseEntity.ok(res);
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
    public void completeCourse(@RequestParam String empId, @RequestParam String certificationId,
            @RequestParam String url, @RequestBody CertificationFeedback certificationFeedback) {
        this.certificationService.certificationCompleted(empId, certificationId, url, certificationFeedback);
    }

    @GetMapping("/failed")
    public void courseFailed(@RequestParam String empId, @RequestParam String certificationId) {
        this.certificationService.certificationFailed(empId, certificationId);
    }

    @GetMapping("/cancel")
    public void cancelNomination(@RequestParam String loggedInUser, @RequestParam String empId,
            @RequestParam String certificationId) {
        this.certificationService.cancelNomination(loggedInUser, empId, certificationId);
    }

    @GetMapping("/certificationReport")
    public List<CertificationReportTemplate> getCertificationReport() {
        return this.certificationService.getCertificationReport();
    }

    @PostMapping("/agreeTC")
    public void getDeviceInfo(@RequestHeader("User-Agent") String userAgent, HttpServletRequest request,
            @RequestParam String empId, @RequestBody ArrayList<String> certificationId) {
        this.certificationService.getDeviceInfo(userAgent, request, empId, certificationId);
    }

    @GetMapping("/email/approveCertification")
    public String assignCertificationFromEmail(@RequestParam String empId, @RequestParam String certificationId) {
        this.certificationService.approveCertification(empId, certificationId);

        return "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "    <title>Email Action</title>"
                + "    <script>"
                + "        function closeCurrentTab() {"
                + "            window.close();"
                + "        }"
                + "    </script>"
                + "</head>"
                + "<body style='text-align:center;'>"
                + "    <p>The certification has been accepted.</p>"
                + "    <button onclick='closeCurrentTab()'>You can close this tab</button>"
                + "    <script>"
                + "        setTimeout(function() {"
                + "            document.querySelector('button').click();"
                + "        }, 5000);"
                + "    </script>"
                + "</body>"
                + "</html>";
    }

    @GetMapping("/email/cancel")
    public String cancelNominationFromEmail(@RequestParam String loggedInUser, @RequestParam String empId,
            @RequestParam String certificationId) {
        this.certificationService.cancelNomination(loggedInUser, empId, certificationId);

        return "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "    <title>Email Action</title>"
                + "    <script>"
                + "        function closeCurrentTab() {"
                + "            window.close();"
                + "        }"
                + "    </script>"
                + "</head>"
                + "<body style='text-align:center;'>"
                + "    <p>The certification has been rejected.</p>"
                + "    <button onclick='closeCurrentTab()'>You can close this tab</button>"
                + "    <script>"
                + "        setTimeout(function() {"
                + "            document.querySelector('button').click();"
                + "        }, 5000);"
                + "    </script>"
                + "</body>"
                + "</html>";
    }

    @GetMapping("/categories")
    public List<String> fetchAllCategories() {
        return this.certificationService.fetchAllDomains();
    }
}
