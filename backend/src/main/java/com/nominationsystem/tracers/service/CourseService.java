package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.Course;
import com.nominationsystem.tracers.models.CourseFeedback;
import com.nominationsystem.tracers.models.Employee;
import com.nominationsystem.tracers.models.EmployeeCourseStatus;
import com.nominationsystem.tracers.repository.CourseFeedbackRepository;
import com.nominationsystem.tracers.repository.CourseRepository;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private CourseFeedbackRepository courseFeedbackRepository;

    LocalDate currentDate = LocalDate.now();
    Month currentMonth = currentDate.getMonth();

    public Course getCourse(String courseName) {
        return courseRepository.findByCourseName(courseName);
    }
    public Course getCourseById(String courseId) {
        return courseRepository.findByCourseId(courseId);
    }

    public List<Course> getAllCourses() {
        List<Course> temp = courseRepository.findAll();

        List<Course> filteredList=temp.stream()
                .filter(obj -> !obj.getDelete())
                .collect(Collectors.toList());;
        return filteredList;
    }

    public Course addCourse(Course course) {
        return (this.courseRepository.save(course));
    }

    public void updateCourse(String courseId, Course updatedCourse) {
        Course existingCourse = getCourseById(courseId);

        System.out.println(existingCourse);

        if(updatedCourse.getCourseName() != null) {
            existingCourse.setCourseName(updatedCourse.getCourseName());
        }
        if(updatedCourse.getDuration() != null) {
            existingCourse.setDuration(updatedCourse.getDuration());
        }
        if(updatedCourse.getDomain() != null) {
            existingCourse.setDomain(updatedCourse.getDomain());
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
        Course existingCourse = getCourseById(courseId);
        existingCourse.setDelete(true);
        courseRepository.save(existingCourse);
    }

    public void changeMonthlyCourseStatus(List<String> courseIds, String month) {

        Month monthEnum = Month.valueOf(month.toUpperCase());

        courseIds.forEach(courseId -> {
            Course course = courseRepository.findByCourseId(courseId);
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

    public void completeCourse(String empId, String courseId, CourseFeedback courseFeedback){
        Employee employee=this.employeeRepository.findByEmpId(empId);

        if(employee!=null){
            employee.getCompletedCourses().add(new EmployeeCourseStatus(courseId, currentMonth));
            employee.removeAssignedCourseById(courseId);
            this.employeeRepository.save(employee);
        }
        this.courseFeedbackRepository.save(courseFeedback);
    }
}
