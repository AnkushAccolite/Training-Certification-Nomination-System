package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.Course;
import com.nominationsystem.tracers.models.CourseFeedback;
import com.nominationsystem.tracers.models.CourseReportTemplate;
import com.nominationsystem.tracers.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Validated
@RequestMapping("/course")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/{name}")
    public ResponseEntity<Course> getCourse(@PathVariable("name") String courseName) {
        Course res = this.courseService.getCourse(courseName);
        return ResponseEntity.ok(res);
    }

    @GetMapping
    public ResponseEntity<List<Course>> getCourses() {
        List<Course> res = this.courseService.getAllCourses();
        return ResponseEntity.ok(res);
    }

    @PostMapping
    public Course addCourse(@RequestBody Course course) {
        return (this.courseService.addCourse(course));
    }

    @PutMapping("/{id}")
    public String updateCourse(@PathVariable("id") String courseId,
                               @RequestBody Course course) {
        this.courseService.updateCourse(courseId, course);
        return "Course edited";
    }

    @PutMapping("/delete/{id}")
    public void deleteCourse(@PathVariable("id") String courseId) {
        this.courseService.deleteCourse(courseId);
    }

    @PostMapping("/change-status")
    public void changeMonthlyCourseStatus(@RequestParam String month,
                                          @RequestParam String band,
                                          @RequestBody List<String> courseIds) {
        this.courseService.changeMonthlyCourseStatus(courseIds, band, month);
    }

    @PostMapping("/completed")
    public void completeCourse(@RequestParam String empId, @RequestParam String courseId,
                               @RequestBody CourseFeedback courseFeedback) {
        this.courseService.completeCourse(empId, courseId, courseFeedback);
    }

    @GetMapping("/courseReport")
    public List<CourseReportTemplate> fetchCourseReport() {
        return this.courseService.getCourseReport();
    }

    @GetMapping("/categories")
    public List<String> fetchAllCategories() {
        return this.courseService.fetchAllDomains();
    }

}
