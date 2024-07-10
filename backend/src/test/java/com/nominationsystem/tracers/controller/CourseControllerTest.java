package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.Course;
import com.nominationsystem.tracers.models.CourseFeedback;
import com.nominationsystem.tracers.models.CourseReportTemplate;
import com.nominationsystem.tracers.service.CourseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CourseControllerTest {

    @Mock
    private CourseService courseService;

    @InjectMocks
    private CourseController courseController;

    private Course course;
    private CourseFeedback courseFeedback;

    @BeforeEach
    public void setUp() {
        course = new Course();
        course.setCourseId("course1");
        course.setCourseName("Java Course");

        courseFeedback = new CourseFeedback();
        courseFeedback.setComment("Great course!");
    }

    @Test
    public void testGetCourse() {
        when(courseService.getCourse(anyString())).thenReturn(course);

        ResponseEntity<Course> response = courseController.getCourse("Java Course");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(course, response.getBody());
    }

    @Test
    public void testGetCourses() {
        List<Course> courses = new ArrayList<>();
        courses.add(course);

        when(courseService.getAllCourses()).thenReturn(courses);

        ResponseEntity<List<Course>> response = courseController.getCourses();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(courses, response.getBody());
    }

    @Test
    public void testAddCourse() {
        when(courseService.addCourse(any(Course.class))).thenReturn(course);

        Course response = courseController.addCourse(course);

        assertEquals(course, response);
    }

    @Test
    public void testUpdateCourse() {
        doNothing().when(courseService).updateCourse(anyString(), any(Course.class));

        String response = courseController.updateCourse("course1", course);

        assertEquals("Course edited", response);
    }

    @Test
    public void testDeleteCourse() {
        doNothing().when(courseService).deleteCourse(anyString());

        courseController.deleteCourse("course1");

        verify(courseService, times(1)).deleteCourse("course1");
    }

    @Test
    public void testChangeMonthlyCourseStatus() {
        doNothing().when(courseService).changeMonthlyCourseStatus(anyList(), anyString(), anyString());

        List<String> courseIds = new ArrayList<>();
        courseIds.add("course1");
        courseController.changeMonthlyCourseStatus("January", "BandA", courseIds);

        verify(courseService, times(1)).changeMonthlyCourseStatus(courseIds, "BandA", "January");
    }

    @Test
    public void testCompleteCourse() {
        doNothing().when(courseService).completeCourse(anyString(), anyString(), any(CourseFeedback.class));

        CourseFeedback feedback = new CourseFeedback();
        feedback.setComment("Great course!");

        courseController.completeCourse("emp1", "course1", feedback);

        verify(courseService, times(1)).completeCourse("emp1", "course1", feedback);
    }

    @Test
    public void testFetchCourseReport() {
        List<CourseReportTemplate> reports = new ArrayList<>();
        reports.add(new CourseReportTemplate());

        when(courseService.getCourseReport("2024")).thenReturn(reports);

        List<CourseReportTemplate> response = courseController.fetchCourseReport("2024");

        assertEquals(reports, response);
    }

    @Test
    public void testFetchAllCategories() {
        List<String> expectedCategories = Arrays.asList("Category1", "Category2");

        when(courseService.fetchAllDomains()).thenReturn(expectedCategories);

        List<String> actualCategories = courseController.fetchAllCategories();

        assertEquals(expectedCategories.size(), actualCategories.size());
        assertEquals(expectedCategories, actualCategories);
    }

    @Test
    public void testFetchAllCategories_EmptyList() {
        when(courseService.fetchAllDomains()).thenReturn(new ArrayList<>());

        List<String> actualCategories = courseController.fetchAllCategories();

        assertNotNull(actualCategories);
        assertTrue(actualCategories.isEmpty());
    }

    @Test
    public void testFetchAllCategories_NullResult() {
        when(courseService.fetchAllDomains()).thenReturn(null);

        List<String> actualCategories = courseController.fetchAllCategories();

        assertNull(actualCategories);
    }
}
