package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.*;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import com.nominationsystem.tracers.repository.NominationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NominationService {

    @Autowired
    private NominationRepository nominationRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

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

    public List<Nomination> getAllRequests(String managerId){
        List<Nomination> allNominations=nominationRepository.findAll();

        return allNominations.stream()
                .filter(nomination -> managerId.equals(nomination.getManagerId()))
                .collect(Collectors.toList());
    }

    public void removeCourseFromAllNominations(String empId,String courseId) {
        List<Nomination> nominations = nominationRepository.findAll();
        for (Nomination nomination : nominations) {
            if(nomination.getEmpId().equals(empId)){
                List<NominatedCourseStatus> nominatedCourses = nomination.getNominatedCourses();
                nominatedCourses.removeIf(course -> course.getCourseId().equals(courseId));
                if (nominatedCourses.isEmpty()) {
                    nominationRepository.deleteById(nomination.getNominationId());
                } else {
                    nominationRepository.save(nomination);
                }
            }

        }
        Employee employee = employeeRepository.findByEmpId(empId);
        if (employee != null) {
            employee.removePendingCourseById(courseId);
        }
        employeeRepository.save(employee);
    }

    public Nomination createNomination(Nomination nomination, Month month) {
        Employee employee = employeeService.getEmployee(nomination.getEmpId());
        nomination.setManagerId(employee.getManagerId());
        nomination.setMonth(month);

        List<NominatedCourseStatus> nominatedCourses = nomination.getNominatedCourses().stream()
                .filter(nominatedCourse -> !employeeService.isPendingCoursePresent(nominatedCourse.getCourseId(),employee.getEmpId()) &&
                        !employeeService.isApprovedCoursePresent(nominatedCourse.getCourseId(),employee.getEmpId()))
                .map(nominatedCourse -> {
                    NominatedCourseStatus newNominatedCourse = new NominatedCourseStatus();
                    newNominatedCourse.setCourseId(nominatedCourse.getCourseId());

                    boolean isApprovalRequired = courseService.getCourseById(nominatedCourse.getCourseId()).getIsApprovalReq();
                    newNominatedCourse.setApprovalStatus(isApprovalRequired ? ApprovalStatus.PENDING : ApprovalStatus.APPROVED);

                    return newNominatedCourse;
                })
                .collect(Collectors.toList());

        if (nominatedCourses.isEmpty()) {
            return null;
        }

        nomination.setNominatedCourses(nominatedCourses);
        employeeService.setCoursesNominatedByEmployee(nomination.getEmpId(), nominatedCourses,month);

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

    public void takeActionOnPendingRequest(String nominationId, String courseId, String action,Month month) {
        Nomination nomination = this.getNomination(nominationId);

        boolean updated = nomination.getNominatedCourses().stream()
                .filter(course -> course.getCourseId().equals(courseId) && course.getApprovalStatus() == ApprovalStatus.PENDING)
                .peek(course -> {
                    switch (action.toLowerCase()) {
                        case "approve":
                            course.setApprovalStatus(ApprovalStatus.APPROVED);
                            break;
                        case "reject":
                            course.setApprovalStatus(ApprovalStatus.REJECTED);
                            break;
                        default:
                            throw new IllegalArgumentException("Invalid action: " + action);
                    }
                    employeeService.updateCoursesNominatedByEmployee(nomination.getEmpId(), courseId, action,nomination.getMonth());
                })
                .findAny()
                .isPresent();

        if (updated) {
            nominationRepository.save(nomination);
        }
    }

}
