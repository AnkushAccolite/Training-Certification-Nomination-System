package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsersServiceImpl implements UsersService {

    @Autowired
    private EmployeeService employeeService;

    @Override
    public Employee getUserByUsername(String username) {
        Optional<Employee> opt = this.employeeService.getEmployeeRepository().findByUsername(username);
        return opt.get();
    }

//    @Override
//    public Employee getUserByEmail(String email) {
//        // TODO Auto-generated method stub
//        return null;
//    }

    @Override
    public Employee saveUser(Employee user) {

        return this.employeeService.getEmployeeRepository().save(user);
    }

//    @Override
//    public List<Employee> getUsersWithRoles(String role) {
//        // TODO Auto-generated method stub
//        return null;
//    }

    @Override
    public boolean isUsernameExists(String username) {
        return this.employeeService.getEmployeeRepository().existsByUsername(username);
    }

    @Override
    public boolean isEmailExists(String email) {
        return this.employeeService.getEmployeeRepository().existsByEmail(email);
    }

}
