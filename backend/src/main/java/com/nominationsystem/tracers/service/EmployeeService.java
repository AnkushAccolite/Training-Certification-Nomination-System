package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.*;
import com.nominationsystem.tracers.repository.CourseFeedbackRepository;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.time.Month;
import java.util.*;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private CourseService courseService;

    @Autowired
    private CourseFeedbackRepository courseFeedbackRepository;

    LocalDate currentDate = LocalDate.now();
    Month currentMonth = currentDate.getMonth();

    public List<Employee> getAllEmployees() {
        return new ArrayList<>(this.employeeRepository.findAll());
    }

    public ResponseEntity<?> getEmpByEmail(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        if (email == null) {
            return ResponseEntity.badRequest().body("Email is required in the request body.");
        }

        Optional<Employee> employee = this.employeeRepository.findByEmail(email);
        return employee.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<?> setRole(String email, String role) {
        Optional<Employee> employee = employeeRepository.findByEmail(email);
        if (employee.isPresent()) {
            employee.get().setRole(role);
            employeeRepository.save(employee.get());
            return ResponseEntity.ok(employee.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<?> addCourses(String email, String courseIds) {
        List<String> courseIdList = Arrays.asList(courseIds.split(","));

        Optional<Employee> employee = employeeRepository.findByEmail(email);
        if (employee.isPresent()) {
            employee.ifPresent(emp -> {
                if (emp.getCourseIds() != null) {
                    emp.getCourseIds().addAll(courseIdList);
                } else {
                    emp.setCourseIds(courseIdList);
                }
            });
            employeeRepository.save(employee.get());
            return ResponseEntity.ok(employee.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public Employee getEmployee(String empId) {
        return this.employeeRepository.findByEmpId(empId);
    }

    public void setCoursesNominatedByEmployee(String empId, List<NominatedCourseStatus> nominatedCourses, Month month) {
        Employee employee = this.employeeRepository.findByEmpId(empId);

        List<EmployeeCourseStatus> approvedCourses = new ArrayList<>();
        List<EmployeeCourseStatus> pendingCourses = new ArrayList<>();

        nominatedCourses.forEach(nominatedCourse -> {
            if (nominatedCourse.getApprovalStatus().equals(ApprovalStatus.APPROVED)) {
                EmployeeCourseStatus temp = new EmployeeCourseStatus(nominatedCourse.getCourseId(), month);
                approvedCourses.add(temp);
            } else if (nominatedCourse.getApprovalStatus().equals(ApprovalStatus.PENDING)) {
                EmployeeCourseStatus temp1 = new EmployeeCourseStatus(nominatedCourse.getCourseId(), month);
                pendingCourses.add(temp1);
            }
        });

        if (employee.getApprovedCourses() == null) {
            employee.setApprovedCourses(new ArrayList<>());
        }
        employee.getApprovedCourses().addAll(approvedCourses);

        if (employee.getPendingCourses() == null) {
            employee.setPendingCourses(new ArrayList<>());
        }
        employee.getPendingCourses().addAll(pendingCourses);

        this.employeeRepository.save(employee);
    }

    public Map<String, List<EmployeeCourseStatus>> getCoursesNominatedByEmployee(String empId) {
        Employee employee = this.getEmployee(empId);
        Map<String, List<EmployeeCourseStatus>> courseList = new HashMap<>();

        courseList.put("approvedCourses", employee.getApprovedCourses());
        courseList.put("pendingCourses", employee.getPendingCourses());
        courseList.put("completedCourses", employee.getCompletedCourses());

        return courseList;
    }


    public void updateCoursesNominatedByEmployee(String empId, String courseId, String action, Month month) {
        Employee employee = this.employeeRepository.findByEmpId(empId);

        if ("approve".equals(action)) {
            employee.removePendingCourseById(courseId);
            employee.getApprovedCourses().add(new EmployeeCourseStatus(courseId, month));
        } else if ("reject".equals(action)) {
            employee.removePendingCourseById(courseId);
        }
        this.employeeRepository.save(employee);
    }

    public ResponseEntity<?> courseCompleted(String empId, String courseId, CourseFeedback courseFeedback) {
        Employee employee = this.getEmployee(empId);

        EmployeeCourseStatus employeeCourseStatus = new EmployeeCourseStatus(courseId, currentMonth);
        if (employee.getCompletedCourses() != null) {
            employee.getCompletedCourses().add(employeeCourseStatus);
        } else {
            ArrayList<EmployeeCourseStatus> temp = new ArrayList<>();
            temp.add(employeeCourseStatus);
            employee.setCompletedCourses(temp);
        }
        employeeRepository.save(employee);
        this.courseFeedbackRepository.save(courseFeedback);

        return ResponseEntity.ok().build();
    }

    // Rename the method correctly
    public Boolean isApprovedCoursePresent(String courseId,String empId) {
        return this.employeeRepository.findByEmpId(empId)
                .getApprovedCourses().stream()
                .anyMatch(courseStatus -> courseStatus.getCourseId().equals(courseId));
    }
    public Boolean isPendingCoursePresent(String courseId,String empId) {
        return this.employeeRepository.findByEmpId(empId)
                .getPendingCourses().stream()
                .anyMatch(courseStatus -> courseStatus.getCourseId().equals(courseId));
    }

    public List<EmployeeReportTemplate> getEmployeeReport() {
        List<Employee> employees = this.getAllEmployees();
        List<EmployeeReportTemplate> employeeReport = new ArrayList<>();

        employees.forEach(emp -> {
                    EmployeeReportTemplate report = new EmployeeReportTemplate();
                    report.setEmpId(emp.getEmpId());
                    report.setEmpName(emp.getEmpName());
                    report.setCompletedCourses(this.getDetailsOfCourseByEmployee(emp.getPendingCourses()));
                    employeeReport.add(report);
                });
        return employeeReport;
    }

    public ArrayList<EmployeeReportCourseDetails> getDetailsOfCourseByEmployee(ArrayList<EmployeeCourseStatus> courseList) {
        ArrayList<EmployeeReportCourseDetails> courseDetailsList = new ArrayList<>();

        courseList.forEach(course -> {
            EmployeeReportCourseDetails courseDetails = new EmployeeReportCourseDetails();
            Course courseData = courseService.getCourseById(course.getCourseId());

            courseDetails.setCourseName(courseData.getCourseName());
            courseDetails.setCategory(courseData.getDomain());
            courseDetails.setMonth(course.getMonth());
            courseDetailsList.add(courseDetails);
        });
        return courseDetailsList;
    }
}
