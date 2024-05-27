package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.*;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Getter
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    @Lazy
    private CourseService courseService;

    @Autowired
    @Lazy
    private CertificationService certificationService;

    private LocalDate currentDate = LocalDate.now();
    private Month currentMonth = currentDate.getMonth();

    public List<Employee> getAllEmployees() {
        return new ArrayList<>(this.employeeRepository.findAll());
    }

    public ResponseEntity<?> getEmpByEmail(String email) {
        if (email == null) {
            return ResponseEntity.badRequest().body("Email is required in the request body.");
        }

        Optional<Employee> employee = this.employeeRepository.findByEmail(email);
        return employee.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<?> setRole(String email, String role) {
        Optional<Employee> employee = this.employeeRepository.findByEmail(email);
        if (employee.isPresent()) {
            employee.get().setRole(role);
            this.employeeRepository.save(employee.get());
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

    public Boolean isApprovedCoursePresent(String courseId, String empId) {
        return this.employeeRepository.findByEmpId(empId)
                .getApprovedCourses().stream()
                .anyMatch(courseStatus -> courseStatus.getCourseId().equals(courseId));
    }

    public Boolean isPendingCoursePresent(String courseId, String empId) {
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
            report.setCompletedCourses(this.getDetailsOfCourseByEmployee(emp.getCompletedCourses()));
            employeeReport.add(report);
        });
        return employeeReport;
    }

    public ArrayList<EmployeeReportCourseDetails> getDetailsOfCourseByEmployee(
            ArrayList<EmployeeCourseStatus> courseList) {
        ArrayList<EmployeeReportCourseDetails> courseDetailsList = new ArrayList<>();

        courseList.forEach(course -> {
            EmployeeReportCourseDetails courseDetails = new EmployeeReportCourseDetails();
            Course courseData = this.courseService.getCourseById(course.getCourseId());

            courseDetails.setCourseName(courseData.getCourseName());
            courseDetails.setDomain(courseData.getDomain());
            courseDetails.setMonth(course.getMonth());
            courseDetailsList.add(courseDetails);
        });
        return courseDetailsList;
    }

    public List<CertificationRequestsTemplate> getCertificationRequests(String managerId) {
        List<Employee> employees = this.employeeRepository.findByManagerId(managerId);
        List<Certification> certifications = this.certificationService.getCertificationRepository().findAll();
        List<CertificationRequestsTemplate> empCertDetailsList = new ArrayList<>();

        Map<String, Certification> certIdToDetailsMap = certifications.stream()
                .collect(Collectors.toMap(
                        Certification::getCertificationId,
                        cert -> cert));

        employees.forEach(employee -> {
            List<Certification> pendingCertificationDetails = employee.getPendingCertifications().stream()
                    .map(certIdToDetailsMap::get)
                    .toList();

            if (!pendingCertificationDetails.isEmpty()) {
                CertificationRequestsTemplate empCertDetails = new CertificationRequestsTemplate();
                empCertDetails.setEmpId(employee.getEmpId());
                empCertDetails.setEmpName(employee.getEmpName());
                empCertDetails.setPendingCertDetails(pendingCertificationDetails);
                empCertDetailsList.add(empCertDetails);
            }
        });
        return empCertDetailsList;
    }

}
