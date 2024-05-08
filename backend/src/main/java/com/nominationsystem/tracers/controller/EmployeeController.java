package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.Course;
import com.nominationsystem.tracers.models.Employee;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import com.nominationsystem.tracers.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
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
}
