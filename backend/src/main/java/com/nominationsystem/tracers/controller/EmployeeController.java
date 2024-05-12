package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.Employee;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import com.nominationsystem.tracers.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

//    @PostMapping("")
//    public ResponseEntity<?> addEmployee(@RequestBody Employee employee) {
//        Employee save=this.employeeService.addEmployee(employee);
//        return ResponseEntity.ok(save);
//    }

    @GetMapping("")
    public ResponseEntity<?> getEmployees() {
        return ResponseEntity.ok(this.employeeService.getAllEmployees());
    }

    @PostMapping("/getByEmail")
    public ResponseEntity<?> getEmployeeByEmail(@RequestBody Map<String, String> requestBody) {
        return this.employeeService.getEmpByEmail(requestBody);
    }

//    @PatchMapping("/updateIsAdmin")
//    public ResponseEntity<?> updateIsAdmin(@RequestParam String email, @RequestParam boolean isAdmin) {
//        return this.employeeService.setAdmin(email,isAdmin);
//    }
    @PatchMapping("/setRole")
    public ResponseEntity<?> setRole(@RequestParam String email, @RequestParam String role) {
        return this.employeeService.setRole(email,role);
    }

    @PatchMapping("/addCourses")
    public ResponseEntity<?> addCoursesToEmployee(@RequestParam String email, @RequestParam String courseIds) {
        return this.employeeService.addCourses(email,courseIds);
    }


}
