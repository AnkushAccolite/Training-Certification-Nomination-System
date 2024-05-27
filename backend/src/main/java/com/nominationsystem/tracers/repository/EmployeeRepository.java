package com.nominationsystem.tracers.repository;

import com.nominationsystem.tracers.models.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends MongoRepository<Employee, String> {

    Optional<Employee> findByUsername(String username);

    Optional<Employee> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    Employee findByEmpId(String empId);

    List<Employee> findAllByOrderByEmpIdAsc();

    List<Employee> findByManagerId(String managerId);
}
