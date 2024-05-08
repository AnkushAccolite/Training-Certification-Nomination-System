package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.Course;
import com.nominationsystem.tracers.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public Course getCourse(String courseName) {
        return courseRepository.findByName(courseName);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public void renderAddCourseForm() {
        //redirect to add form
    }

    public Course addCourse(Course course) {
        return (this.courseRepository.save(course));
    }

    public void renderUpdateCourseForm(String courseId) {
        //redirect to update form
    }

    public void updateCourse(String courseId, Course updatedCourse) {
        Course existingCourse = getCourse(courseId);

        if(updatedCourse.getName() != null) {
            existingCourse.setName(updatedCourse.getName());
        }
        if(updatedCourse.getDuration() != null) {
            existingCourse.setDuration(updatedCourse.getDuration());
        }
        if(updatedCourse.getCategory() != null) {
            existingCourse.setCategory(updatedCourse.getCategory());
        }
        if(updatedCourse.getIsApprovalReq() != null) {
            existingCourse.setIsApprovalReq(updatedCourse.getIsApprovalReq());
        }

        courseRepository.save(existingCourse);
    }

    public void deleteCourse(String courseId) {
        this.courseRepository.deleteById(courseId);
    }

}
