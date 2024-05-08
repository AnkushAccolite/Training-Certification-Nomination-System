package com.nominationsystem.tracers.repository;

import com.nominationsystem.tracers.models.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EmployeeRepository extends MongoRepository<Employee, String> {
    String findManagerIdByEmpId(String empId);
}
