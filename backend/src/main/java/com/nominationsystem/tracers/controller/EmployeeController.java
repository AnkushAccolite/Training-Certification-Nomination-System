package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.CertificationRequestsTemplate;
import com.nominationsystem.tracers.models.EmployeeCourseStatus;
import com.nominationsystem.tracers.models.EmployeeReportTemplate;
import com.nominationsystem.tracers.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("")
    public ResponseEntity<?> getEmployees() {
        return ResponseEntity.ok(this.employeeService.getAllEmployees());
    }

    @GetMapping("/getByEmail")
    public ResponseEntity<?> getEmployeeByEmail(@RequestParam String email) {
        return this.employeeService.getEmpByEmail(email);
    }

    @PatchMapping("/setRole")
    public ResponseEntity<?> setRole(@RequestParam String email, @RequestParam String role) {
        return this.employeeService.setRole(email, role);
    }

    @GetMapping("/status")
    public Map<String, List<EmployeeCourseStatus>> getCoursesNominatedByEmployee(@RequestParam String empId) {
        return this.employeeService.getCoursesNominatedByEmployee(empId);
    }

    @GetMapping("/employeeReport")
    public List<EmployeeReportTemplate> getEmployeeReport() {
        return this.employeeService.getEmployeeReport();
    }

    @GetMapping("/pending-certifications")
    public List<CertificationRequestsTemplate> getCertificationRequests(@RequestParam String managerId) {
        return this.employeeService.getCertificationRequests(managerId);
    }

}
