package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.Course;
import com.nominationsystem.tracers.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/course")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @PostMapping("/")
    public ResponseEntity<?> addCourse(@RequestBody Course course) {
        Course save = this.courseRepository.save(course);
        return ResponseEntity.ok(save);
    }

    @GetMapping("/")
    public ResponseEntity<?> getCourses() {
        List<Course> res = this.courseRepository.findAll();
        return ResponseEntity.ok(res);
    }

}
