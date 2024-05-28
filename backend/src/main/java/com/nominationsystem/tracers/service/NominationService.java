package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.*;
import com.nominationsystem.tracers.repository.NominationRepository;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NominationService {

    @Getter
    @Autowired
    private NominationRepository nominationRepository;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private EmailService emailService;

    public Nomination getNomination(String nominationId) {
        return this.nominationRepository.findById(nominationId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
    }

    public List<Nomination> getAllNominations() {
        return this.nominationRepository.findAll();
    }

    public List<Nomination> getAllRequests(String managerId) {
        List<Nomination> allNominations = this.nominationRepository.findAll();

        return allNominations.stream()
                .filter(nomination -> managerId.equals(nomination.getManagerId()))
                .collect(Collectors.toList());
    }

    public void removeCourseFromAllNominations(String empId, String courseId) {
        List<Nomination> nominations = this.nominationRepository.findAll();
        for (Nomination nomination : nominations) {
            if (nomination.getEmpId().equals(empId)) {
                List<NominatedCourseStatus> nominatedCourses = nomination.getNominatedCourses();
                nominatedCourses.removeIf(course -> course.getCourseId().equals(courseId));
                if (nominatedCourses.isEmpty()) {
                    this.nominationRepository.deleteById(nomination.getNominationId());
                } else {
                    this.nominationRepository.save(nomination);
                }
            }

        }
        Employee employee = this.employeeService.getEmployeeRepository().findByEmpId(empId);
        if (employee != null) {
            employee.removePendingCourseById(courseId);
            this.employeeService.getEmployeeRepository().save(employee);
        }
    }

    public Nomination createNomination(Nomination nomination, Month month) {
        Employee employee = this.employeeService.getEmployee(nomination.getEmpId());
        nomination.setManagerId(employee.getManagerId());
        nomination.setMonth(month);

        List<NominatedCourseStatus> nominatedCourses = nomination.getNominatedCourses().stream()
                .filter(nominatedCourse -> !this.employeeService.isPendingCoursePresent(nominatedCourse.getCourseId(), employee.getEmpId())
                        && !this.employeeService.isApprovedCoursePresent(nominatedCourse.getCourseId(), employee.getEmpId()))
                .map(nominatedCourse -> {
                    NominatedCourseStatus newNominatedCourse = new NominatedCourseStatus();
                    newNominatedCourse.setCourseId(nominatedCourse.getCourseId());

                    boolean isApprovalRequired = this.courseService.getCourseById(nominatedCourse.getCourseId()).getIsApprovalReq();
                    newNominatedCourse.setApprovalStatus(isApprovalRequired ? ApprovalStatus.PENDING : ApprovalStatus.APPROVED);

                    return newNominatedCourse;
                })
                .collect(Collectors.toList());

        if (nominatedCourses.isEmpty()) {
            return null;
        }

        nomination.setNominatedCourses(nominatedCourses);
        this.employeeService.setCoursesNominatedByEmployee(nomination.getEmpId(), nominatedCourses, month);

        String courseList = nominatedCourses.stream()
                .map(course -> this.courseService.getCourseById(course.getCourseId()).getCourseName())
                .collect(Collectors.joining("\n\t"));
        Employee manager = this.employeeService.getEmployee(nomination.getManagerId());
        String body = this.emailService.createPendingRequestEmailBody(manager.getEmpName(), employee.getEmpId(),
                employee.getEmpName(), courseList, "Courses");

        this.emailService.sendEmail(manager.getEmail(), "Approval request for nomination", body);

        return this.nominationRepository.save(nomination);
    }

    public Nomination updateNomination(String nominationId, Nomination updatedNomination) {
        Nomination existingNomination = getNomination(nominationId);

        if (updatedNomination.getCertifId() != null) {
            existingNomination.setCertifId(updatedNomination.getCertifId());
        }
        if (updatedNomination.getCourseSuggestions() != null) {
            existingNomination.setCourseSuggestions(updatedNomination.getCourseSuggestions());
        }

        return this.nominationRepository.save(existingNomination);
    }

    public void deleteNomination(String nominationId) {
        this.nominationRepository.deleteById(nominationId);
    }

    public void takeActionOnPendingRequest(String nominationId, String courseId, String action, Month month) {
        Nomination nomination = this.getNomination(nominationId);
        Employee employee = this.employeeService.getEmployee(nomination.getEmpId());
        String courseName = this.courseService.getCourseById(courseId).getCourseName();

        boolean updated = nomination.getNominatedCourses().stream()
                .filter(course -> course.getCourseId().equals(courseId) && course.getApprovalStatus() == ApprovalStatus.PENDING)
                .peek(course -> {
                    switch (action.toLowerCase()) {
                        case "approve":
                            course.setApprovalStatus(ApprovalStatus.APPROVED);
                            String acceptedBody = this.emailService.createApprovalEmailBody(employee.getEmpName(),
                                    courseName, "Course");
                            this.emailService.sendEmail(employee.getEmail(), "Nomination request approved", acceptedBody);
                            break;
                        case "reject":
                            course.setApprovalStatus(ApprovalStatus.REJECTED);
                            String rejectedBody = this.emailService.createRejectionEmailBody(employee.getEmpName(),
                                    courseName, "Course");
                            this.emailService.sendEmail(employee.getEmail(),"Nomination request rejected", rejectedBody);
                            break;
                        default:
                            throw new IllegalArgumentException("Invalid action: " + action);
                    }
                    this.employeeService.updateCoursesNominatedByEmployee(nomination.getEmpId(), courseId, action,
                            nomination.getMonth());
                })
                .findAny()
                .isPresent();

        if (updated) {
            this.nominationRepository.save(nomination);
        }
    }

}
