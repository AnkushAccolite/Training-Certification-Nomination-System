package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.Employee;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;


//    public Employee addEmployee(Employee employee) {
//        String hashedPassword = utilityServices.encodePassword(employee.getHashPswd());
//        employee.setHashPswd(hashedPassword);
//        Employee save = this.employeeRepository.save(employee);
//        return save;
//    }

    public List<Employee> getAllEmployees(){
        return this.employeeRepository.findAll();
    }

    // Other service methods for CRUD operations
}

