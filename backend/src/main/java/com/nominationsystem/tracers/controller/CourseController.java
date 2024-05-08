package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.Course;
import com.nominationsystem.tracers.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/course")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/{name}")
    public ResponseEntity<Course> getCourse(@PathVariable("name") String courseName) {
        Course res = this.courseService.getCourse(courseName);
        return ResponseEntity.ok(res);
    }

    @GetMapping("")
    public ResponseEntity<List<Course>> getCourses() {
        List<Course> res = this.courseService.getAllCourses();
        return ResponseEntity.ok(res);
    }

    @GetMapping("/add")
    public void addCourseForm() {
        this.courseService.renderAddCourseForm();
    }

    @PostMapping("")
    public Course addCourse(@RequestBody Course course) {
        return (this.courseService.addCourse(course));
    }

    @GetMapping("/edit/{id}")
    public void updateCourseForm(@PathVariable("id") String courseId) {
        this.courseService.renderUpdateCourseForm(courseId);
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

}
