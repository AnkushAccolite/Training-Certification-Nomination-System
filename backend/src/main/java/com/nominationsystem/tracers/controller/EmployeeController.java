package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.Employee;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping("/")
    public ResponseEntity<?> addEmployee(@RequestBody Employee employee) {
        Employee save = this.employeeRepository.save(employee);
        return ResponseEntity.ok(save);
    }

    @GetMapping("/")
    public ResponseEntity<?> getEmployees() {
        return ResponseEntity.ok(this.employeeRepository.findAll());
    }
}
