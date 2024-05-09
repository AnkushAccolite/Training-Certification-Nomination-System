package com.nominationsystem.tracers.service;

import java.util.List;

import com.nominationsystem.tracers.models.Employee;


public interface UsersService {


    public Employee getUserByUsername(String username);

    public Employee getUserByEmail(String email);

    public Employee saveUser(Employee user);

    public List<Employee> getUsersWithRoles(String role);

    public boolean isUsernameExists(String username);

    public boolean isEmailExists(String email);


}
