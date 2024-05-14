package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.ApprovalStatus;
import com.nominationsystem.tracers.models.NominatedCourseStatus;
import com.nominationsystem.tracers.models.Employee;
import com.nominationsystem.tracers.models.Nomination;
import com.nominationsystem.tracers.repository.NominationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NominationService {

    @Autowired
    private NominationRepository nominationRepository;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private CourseService courseService;

    public Nomination getNomination(String nominationId) {
        return nominationRepository.findById(nominationId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
    }

    public List<Nomination> getAllNominations() {
        return nominationRepository.findAll();
    }

    public Nomination createNomination(Nomination nomination) {
        Employee employee = employeeService.getEmployee(nomination.getEmpId());
        nomination.setManagerId(employee.getManagerId());

        List<String> pendingCourses = employee.getPendingCourses() != null ? employee.getPendingCourses() : Collections.emptyList();
        List<String> approvedCourses = employee.getApprovedCourses() != null ? employee.getApprovedCourses() : Collections.emptyList();

        List<NominatedCourseStatus> nominatedCourses = nomination.getNominatedCourses().stream()
                .filter(nominatedCourse -> !pendingCourses.contains(nominatedCourse.getCourseName()) &&
                        !approvedCourses.contains(nominatedCourse.getCourseName()))
                .map(nominatedCourse -> {
                    NominatedCourseStatus newNominatedCourse = new NominatedCourseStatus();
                    newNominatedCourse.setCourseName(nominatedCourse.getCourseName());

                    boolean isApprovalRequired = courseService.getCourse(nominatedCourse.getCourseName()).getIsApprovalReq();
                    newNominatedCourse.setApprovalStatus(isApprovalRequired ? ApprovalStatus.PENDING : ApprovalStatus.APPROVED);

                    return newNominatedCourse;
                })
                .collect(Collectors.toList());

        if (nominatedCourses.isEmpty()) {
            return null;
        }

        nomination.setNominatedCourses(nominatedCourses);
        employeeService.setCoursesNominatedByEmployee(nomination.getEmpId(), nominatedCourses);

        return nominationRepository.save(nomination);
    }

    public Nomination updateNomination(String nominationId, Nomination updatedNomination) {
        Nomination existingNomination = getNomination(nominationId);

        if(updatedNomination.getCertifId() != null) {
            existingNomination.setCertifId(updatedNomination.getCertifId());
        }
        if(updatedNomination.getCourseSuggestions() != null) {
            existingNomination.setCourseSuggestions(updatedNomination.getCourseSuggestions());
        }

        return nominationRepository.save(existingNomination);
    }

    public void deleteNomination(String nominationId) {
        nominationRepository.deleteById(nominationId);
    }

    public void takeActionOnPendingRequest(String nominationId, String courseName, String action) {
        Nomination nomination = this.getNomination(nominationId);

        boolean updated = nomination.getNominatedCourses().stream()
                .filter(course -> course.getCourseName().equals(courseName) && course.getApprovalStatus() == ApprovalStatus.PENDING)
                .peek(course -> {
                    switch (action.toLowerCase()) {
                        case "approve":
                            course.setApprovalStatus(ApprovalStatus.APPROVED);
                            break;
                        case "reject":
                            course.setApprovalStatus(ApprovalStatus.REJECTED);
                            break;
                        default:
                            System.out.println("Hi");
                            throw new IllegalArgumentException("Invalid action: " + action);
                    }
                    System.out.println(action);
                    employeeService.updateCoursesNominatedByEmployee(nomination.getEmpId(), courseName, action);
                })
                .findAny()
                .isPresent();

        if (updated) {
            nominationRepository.save(nomination);
        }
    }

}
