package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.*;
import com.nominationsystem.tracers.repository.CourseFeedbackRepository;
import com.nominationsystem.tracers.repository.CourseRepository;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.annotation.Lazy;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private CourseFeedbackRepository courseFeedbackRepository;

    @Mock
    @Lazy
    private EmployeeService employeeService;

    @InjectMocks
    private CourseService courseService;

    private Course course;
    private Employee employee;
    private CourseFeedback courseFeedback;

    @BeforeEach
    public void setUp() {
        course = new Course();
        course.setCourseId("course1");
        course.setCourseName("Java Programming");

        employee = new Employee();
        employee.setEmpId("emp1");
        employee.setCompletedCourses(new ArrayList<>());
        employee.setAssignedCourses(new ArrayList<>());

        courseFeedback = new CourseFeedback();
        courseFeedback.setId("feedback1");
        courseFeedback.setFeedback("Good course!");
    }

    @Test
    public void testGetCourse() {
        when(courseRepository.findByCourseName(anyString())).thenReturn(course);

        Course result = courseService.getCourse("Java Programming");

        assertEquals(course, result);
    }

    @Test
    public void testGetCourseById() {
        when(courseRepository.findByCourseId(anyString())).thenReturn(course);

        Course result = courseService.getCourseById("course1");

        assertEquals(course, result);
    }
}
