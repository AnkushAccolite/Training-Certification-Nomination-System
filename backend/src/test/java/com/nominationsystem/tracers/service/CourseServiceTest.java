package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.*;
import com.nominationsystem.tracers.repository.CourseFeedbackRepository;
import com.nominationsystem.tracers.repository.CourseRepository;
import com.nominationsystem.tracers.repository.CustomCourseRepositoryImpl;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.annotation.Lazy;

import java.time.Month;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
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
    private CustomCourseRepositoryImpl customCourseRepository;

    @Mock
    @Lazy
    private EmployeeService employeeService;

    @InjectMocks
    private CourseService courseService;

    private Course course;
    private Employee employee;
    private CourseFeedback courseFeedback;
    private MonthlyCourseStatus monthlyCourseStatus;


    @BeforeEach
    public void setUp() {
        course = new Course();
        course.setCourseId("course1");
        course.setCourseName("Java Programming");
        course.setDelete(false);

        employee = new Employee();
        employee.setEmpId("emp1");
        employee.setCompletedCourses(new ArrayList<>());

        courseFeedback = new CourseFeedback();
        courseFeedback.setFeedbackId("feedback1");
        courseFeedback.setComment("Good course!");

        monthlyCourseStatus = new MonthlyCourseStatus();
        monthlyCourseStatus.setMonth(Month.JANUARY);
        monthlyCourseStatus.setBands(new ArrayList<>(Arrays.asList("A", "B")));

        course.setMonthlyStatus(new ArrayList<>(List.of(monthlyCourseStatus)));
    }

    @Test
    void testGetCourseRepository() {
        assertEquals(courseRepository, courseService.getCourseRepository());
    }

    @Test
    public void testGetCourse() {
        when(courseRepository.findByCourseName(anyString())).thenReturn(course);

        Course result = courseService.getCourse("Java Programming");

        assertEquals(course, result);
        verify(courseRepository, times(1)).findByCourseName(anyString());
    }

    @Test
    public void testGetCourseById() {
        when(courseRepository.findByCourseId(anyString())).thenReturn(course);

        Course result = courseService.getCourseById("course1");

        assertEquals(course, result);
        verify(courseRepository, times(1)).findByCourseId(anyString());
    }

    @Test
    public void testGetAllCourses() {
        Course course2 = new Course();
        course2.setCourseId("course2");
        course2.setCourseName("Python Programming");
        course2.setDelete(true);

        List<Course> courses = Arrays.asList(course, course2);

        when(courseRepository.findAll()).thenReturn(courses);

        List<Course> result = courseService.getAllCourses();

        assertEquals(1, result.size());
        assertEquals(course, result.get(0));
        verify(courseRepository, times(1)).findAll();
    }

    @Test
    public void testAddCourse() {
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        Course result = courseService.addCourse(course);

        assertEquals(course, result);
        verify(courseRepository, times(1)).save(any(Course.class));
    }

    @Test
    public void testUpdateCourse() {
        Course updatedCourse = new Course();
        updatedCourse.setCourseName("Advanced Java");

        when(courseRepository.findByCourseId(anyString())).thenReturn(course);

        courseService.updateCourse("course1", updatedCourse);

        assertEquals("Advanced Java", course.getCourseName());
        verify(courseRepository, times(1)).findByCourseId(anyString());
        verify(courseRepository, times(1)).save(course);
    }

    @Test
    public void testDeleteCourse() {
        when(courseRepository.findByCourseId(anyString())).thenReturn(course);

        courseService.deleteCourse("course1");

        assertEquals(true, course.getDelete());
        verify(courseRepository, times(1)).findByCourseId(anyString());
        verify(courseRepository, times(1)).save(course);
    }

    @Test
    public void testChangeMonthlyCourseStatus_CourseExists_MonthExists_AddBand() {
        when(courseRepository.findByCourseId(anyString())).thenReturn(course);

        courseService.changeMonthlyCourseStatus(Arrays.asList("course1"), "C", "JANUARY");

        verify(courseRepository, times(1)).save(any(Course.class));
        assert (monthlyCourseStatus.getBands().contains("C"));
    }

    @Test
    public void testChangeMonthlyCourseStatus_CourseExists_MonthExists_RemoveBand() {
        when(courseRepository.findByCourseId(anyString())).thenReturn(course);

        courseService.changeMonthlyCourseStatus(Arrays.asList("course1"), "B", "JANUARY");

        verify(courseRepository, times(1)).save(any(Course.class));
        assert (!monthlyCourseStatus.getBands().contains("B"));
    }

    @Test
    public void testChangeMonthlyCourseStatus_CourseNotExists() {
        when(courseRepository.findByCourseId(anyString())).thenReturn(null);

        courseService.changeMonthlyCourseStatus(Arrays.asList("course1"), "C", "JANUARY");

        verify(courseRepository, times(0)).save(any(Course.class));
    }

    @Test
    public void testChangeMonthlyCourseStatus_BandsListNull() {
        monthlyCourseStatus.setBands(null);
        when(courseRepository.findByCourseId(anyString())).thenReturn(course);

        courseService.changeMonthlyCourseStatus(Arrays.asList("course1"), "C", "JANUARY");

        verify(courseRepository, times(1)).save(any(Course.class));
        assert (course.getMonthlyStatus().get(0).getBands().contains("C"));
    }

    @Test
    public void testCompleteCourse() {
        when(employeeService.getEmployeeRepository()).thenReturn(employeeRepository);
        when(employeeRepository.findByEmpId(anyString())).thenReturn(employee);

        courseService.completeCourse("emp1", "course1", courseFeedback);

        assertEquals(1, employee.getCompletedCourses().size());
        assertEquals(0, employee.getApprovedCourses().size());
        verify(employeeRepository, times(1)).save(employee);
        verify(courseFeedbackRepository, times(1)).save(any(CourseFeedback.class));
    }

    @Test
    public void testGetCourseReport() {
        List<Course> courses = Collections.singletonList(course);

        when(courseRepository.findAll()).thenReturn(courses);

        List<CourseReportTemplate> result = courseService.getCourseReport("2023");

        assertEquals(1, result.size());
        assertEquals("course1", result.get(0).getCourseId());
        verify(courseRepository, times(1)).findAll();
    }

    @Test
    public void testGetMonthlyDetailsOfSingleCourse() {
        List<Employee> employees = Collections.singletonList(employee);

        when(employeeService.getAllEmployees()).thenReturn(employees);

        List<CourseReportEmployeeDetails> result = courseService.getMonthlyDetailsOfSingleCourse("course1", "2023");

        assertEquals(0, result.size());
        verify(employeeService, times(1)).getAllEmployees();
    }

    @Test
    public void testFetchAllDomains() {
        List<String> domains = Arrays.asList("IT", "HR");

        when(customCourseRepository.findDistinctDomains()).thenReturn(domains);

        List<String> result = courseService.fetchAllDomains();

        assertEquals(2, result.size());
        assertEquals("IT", result.get(0));
        verify(customCourseRepository, times(1)).findDistinctDomains();
    }
}
