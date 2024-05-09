package com.nominationsystem.tracers.service;


import com.nominationsystem.tracers.models.Employee;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsersServiceImpl implements UsersService{

    @Autowired
    private EmployeeRepository employeeRepository;


    @Override
    public Employee getUserByUsername(String username) {
        Optional<Employee> opt = employeeRepository.findByUsername(username);
        return opt.get();
    }

    @Override
    public Employee getUserByEmail(String email) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Employee saveUser(Employee user) {

        return employeeRepository.save(user);
    }

    @Override
    public List<Employee> getUsersWithRoles(String role) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public boolean isUsernameExists(String username) {
        return employeeRepository.existsByUsername(username);
    }

    @Override
    public boolean isEmailExists(String email) {
        return employeeRepository.existsByEmail(email);
    }

}
