package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.Course;
import com.nominationsystem.tracers.models.CourseFeedback;
import com.nominationsystem.tracers.models.Employee;
import com.nominationsystem.tracers.models.EmployeeCourseStatus;
import com.nominationsystem.tracers.repository.CourseFeedbackRepository;
import com.nominationsystem.tracers.models.CourseReportEmployeeDetails;
import com.nominationsystem.tracers.models.CourseReportTemplate;
import com.nominationsystem.tracers.repository.CourseRepository;
import com.nominationsystem.tracers.repository.CustomCourseRepositoryImpl;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.Month;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Getter
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseFeedbackRepository courseFeedbackRepository;

    @Autowired
    @Lazy
    private EmployeeService employeeService;

    @Autowired
    private CustomCourseRepositoryImpl customCourseRepository;

    public Course getCourse(String courseName) {
        return this.courseRepository.findByCourseName(courseName);
    }

    public Course getCourseById(String courseId) {
        return this.courseRepository.findByCourseId(courseId);
    }

    public List<Course> getAllCourses() {
        List<Course> temp = this.courseRepository.findAll();

        List<Course> filteredList = temp.stream()
                .filter(obj -> !obj.getDelete())
                .collect(Collectors.toList());
        ;
        return filteredList;
    }

    public Course addCourse(Course course) {
        return (this.courseRepository.save(course));
    }

    public void updateCourse(String courseId, Course updatedCourse) {
        Course existingCourse = getCourseById(courseId);

        System.out.println(existingCourse);

        if (updatedCourse.getCourseName() != null) {
            existingCourse.setCourseName(updatedCourse.getCourseName());
        }
        if (updatedCourse.getDuration() != null) {
            existingCourse.setDuration(updatedCourse.getDuration());
        }
        if (updatedCourse.getDomain() != null) {
            existingCourse.setDomain(updatedCourse.getDomain());
        }
        if (updatedCourse.getDescription() != null) {
            existingCourse.setDescription(updatedCourse.getDescription());
        }
        if (updatedCourse.getIsApprovalReq() != null) {
            existingCourse.setIsApprovalReq(updatedCourse.getIsApprovalReq());
        }

        this.courseRepository.save(existingCourse);
    }

    public void deleteCourse(String courseId) {
        Course existingCourse = getCourseById(courseId);
        existingCourse.setDelete(true);
        this.courseRepository.save(existingCourse);
    }

    public void changeMonthlyCourseStatus(List<String> courseIds, String band, String month) {
        Month monthEnum = Month.valueOf(month.toUpperCase());
        courseIds.forEach(courseId -> {
            Course course = this.courseRepository.findByCourseId(courseId);
            if (course != null) {
                course.getMonthlyStatus().stream()
                        .filter(status -> status.getMonth() == monthEnum)
                        .findFirst()
                        .ifPresent(status -> {
                            ArrayList<String> bands = status.getBands();
                            if (bands == null) {
                                bands = new ArrayList<>();
                                status.setBands(bands);
                            }
                            boolean currentActivationStatus = bands.contains(band);
                            if (!currentActivationStatus) {
                                bands.add(band);
                            } else {
                                bands.remove(band);
                            }
                            status.setBands(bands);
                            this.courseRepository.save(course);
                        });
            }
        });
    }


    public void completeCourse(String empId, String courseId, CourseFeedback courseFeedback) {
        Employee employee = this.employeeService.getEmployeeRepository().findByEmpId(empId);

        if (employee != null) {
            String currentDate = new SimpleDateFormat("dd-MM-yyyy").format(new Date());
            employee.getCompletedCourses().add(new EmployeeCourseStatus(courseId, currentDate));
            employee.removeAssignedCourseById(courseId);
            this.employeeService.getEmployeeRepository().save(employee);
        }
        this.courseFeedbackRepository.save(courseFeedback);
    }

    public List<CourseReportTemplate> getCourseReport(String year) {
        List<Course> courses = this.getAllCourses();
        List<CourseReportTemplate> courseReport = new ArrayList<>();

        courses.forEach(course -> {
            CourseReportTemplate report = new CourseReportTemplate();
            report.setCourseId(course.getCourseId());
            report.setCourseName(course.getCourseName());
            report.setDomain(course.getDomain());
            report.setMonthlyDetails(this.getMonthlyDetailsOfSingleCourse(course.getCourseId(), year));
            courseReport.add(report);
        });
        return courseReport;
    }

    public List<CourseReportEmployeeDetails> getMonthlyDetailsOfSingleCourse(String courseId, String year) {
        List<Employee> employeeList = this.employeeService.getAllEmployees();
        List<CourseReportEmployeeDetails> courseMonthlyDetailsList = new ArrayList<>();

        for (Month month : Month.values()) {
            CourseReportEmployeeDetails courseMonthlyDetails = new CourseReportEmployeeDetails();
            courseMonthlyDetails.setMonth(month);
            AtomicInteger approvedCoursesCount = new AtomicInteger();
            AtomicInteger completedCoursesCount = new AtomicInteger();

            employeeList.forEach(employee -> {
                approvedCoursesCount.addAndGet((int) employee.getApprovedCourses().stream()
                        .filter(course -> course.getCourseId().equals(courseId))
                        .filter(course -> course.getDate().substring(6).equals(year))
                        .filter(course -> Integer.parseInt(course.getDate().substring(3, 5)) == month.getValue())
                        .count());

                completedCoursesCount.addAndGet((int) employee.getCompletedCourses().stream()
                        .filter(course -> course.getCourseId().equals(courseId))
                        .filter(course -> course.getDate().substring(6).equals(year))
                        .filter(course -> Integer.parseInt(course.getDate().substring(3, 5)) == month.getValue())
                        .count());
            });

            int employeesEnrolled = approvedCoursesCount.get() + completedCoursesCount.get();
            if (employeesEnrolled == 0)
                continue;
            double percentage = (double) completedCoursesCount.get() * 100 / employeesEnrolled;
            String attendance = String.format("%.2f", percentage);
            attendance = attendance.indexOf('.') < 0 ? attendance
                    : attendance.replaceAll("0*$", "").replaceAll("\\.$", "");

            courseMonthlyDetails.setEmployeesEnrolled(employeesEnrolled);
            courseMonthlyDetails.setEmployeesCompleted(completedCoursesCount.get());
            courseMonthlyDetails.setAttendance(attendance);
            courseMonthlyDetailsList.add(courseMonthlyDetails);
        }
        return courseMonthlyDetailsList;
    }

    public List<String> fetchAllDomains() {
        return this.customCourseRepository.findDistinctDomains();
    }

}
