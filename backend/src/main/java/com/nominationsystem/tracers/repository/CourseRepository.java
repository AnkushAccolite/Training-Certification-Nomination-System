package com.nominationsystem.tracers.repository;

import com.nominationsystem.tracers.models.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CourseRepository extends MongoRepository<Course, String> {

    Course findByName(String courseName);
}
