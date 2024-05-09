package com.nominationsystem.tracers.repository;

import com.nominationsystem.tracers.models.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends MongoRepository<Course, String> {

    Course findByCourseName(String courseName);
}
