package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.Course;
import com.nominationsystem.tracers.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Validated
@CrossOrigin(origins="*")
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

    @DeleteMapping("")
    public void deleteCourse(@RequestParam("id") String courseId) {
        this.courseService.deleteCourse(courseId);
    }

    @PostMapping("/change-status")
    public void changeMonthlyCourseStatus(@RequestParam String month,
                                          @RequestBody List<String> courseNames) {
        this.courseService.changeMonthlyCourseStatus(courseNames, month);
    }

}
