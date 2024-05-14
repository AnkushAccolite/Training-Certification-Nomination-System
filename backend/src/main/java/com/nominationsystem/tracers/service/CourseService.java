package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.Course;
import com.nominationsystem.tracers.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public Course getCourse(String courseName) {
        return courseRepository.findByCourseName(courseName);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course addCourse(Course course) {
        return (this.courseRepository.save(course));
    }

    public void updateCourse(String courseId, Course updatedCourse) {
        Course existingCourse = getCourse(courseId);

        if(updatedCourse.getCourseName() != null) {
            existingCourse.setCourseName(updatedCourse.getCourseName());
        }
        if(updatedCourse.getDuration() != null) {
            existingCourse.setDuration(updatedCourse.getDuration());
        }
        if(updatedCourse.getCategory() != null) {
            existingCourse.setCategory(updatedCourse.getCategory());
        }
        if(updatedCourse.getDescription() != null) {
            existingCourse.setDescription(updatedCourse.getDescription());
        }
        if(updatedCourse.getIsApprovalReq() != null) {
            existingCourse.setIsApprovalReq(updatedCourse.getIsApprovalReq());
        }

        courseRepository.save(existingCourse);
    }

    public void deleteCourse(String courseId) {
        this.courseRepository.deleteById(courseId);
    }

    public void changeMonthlyCourseStatus(List<String> courseNames, String month) {

        Month monthEnum = Month.valueOf(month.toUpperCase());

        courseNames.forEach(courseName -> {
            Course course = courseRepository.findByCourseName(courseName);
            if (course != null) {
                course.getMonthlyStatus().stream()
                        .filter(status -> status.getMonth() == monthEnum)
                        .findFirst()
                        .ifPresent(status -> {
                            status.setActivationStatus(!status.isActivationStatus());
                            courseRepository.save(course);
                        });
            }
        });
    }
}
