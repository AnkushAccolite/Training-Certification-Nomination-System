package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.*;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import com.nominationsystem.tracers.repository.NominationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Month;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NominationServiceTest {

    @Mock
    private NominationRepository nominationRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private EmployeeService employeeService;

    @Mock
    private CourseService courseService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private NominationService nominationService;

    private Nomination nomination;
    private Employee employee;
    private Course course;

    @BeforeEach
    void setUp() {
        nomination = new Nomination();
        nomination.setNominationId("nomination1");
        nomination.setEmpId("emp1");
        nomination.setManagerId("manager1");
        nomination.setNominatedCourses(new ArrayList<>());

        employee = new Employee();
        employee.setEmpId("emp1");
        employee.setManagerId("manager1");

        course = new Course();
        course.setCourseId("course1");
        course.setIsApprovalReq(true);
    }

    @Test
    void testGetNominationRepository() {
        assertEquals(nominationRepository, nominationService.getNominationRepository());
    }

    @Test
    void testGetNomination() {
        when(nominationRepository.findById("nomination1")).thenReturn(java.util.Optional.of(nomination));

        Nomination result = nominationService.getNomination("nomination1");

        assertEquals(nomination, result);
    }

    @Test
    void testGetAllNominations() {
        List<Nomination> nominations = Arrays.asList(nomination);
        when(nominationRepository.findAll()).thenReturn(nominations);

        List<Nomination> result = nominationService.getAllNominations();

        assertEquals(nominations, result);
    }

    @Test
    void testGetAllRequests() {
        when(nominationRepository.findAll()).thenReturn(Arrays.asList(nomination));

        List<Nomination> result = nominationService.getAllRequests("manager1");

        assertEquals(Arrays.asList(nomination), result);
    }

    @Test
    void testRemoveCourseFromAllNominations() {
        NominatedCourseStatus nominatedCourseStatus = new NominatedCourseStatus();
        nominatedCourseStatus.setCourseId("course1");

        nomination.getNominatedCourses().add(nominatedCourseStatus);

        when(nominationRepository.findAll()).thenReturn(Arrays.asList(nomination));
        when(employeeService.getEmployeeRepository()).thenReturn(employeeRepository);
        when(employeeRepository.findByEmpId("emp1")).thenReturn(employee);

        nominationService.removeCourseFromAllNominations("emp1", "course1");

        assertTrue(nomination.getNominatedCourses().isEmpty());
        verify(nominationRepository, times(1)).deleteById("nomination1");
        verify(employeeRepository, times(1)).save(employee);
    }

    @Test
    void testCreateNomination() {
        NominatedCourseStatus nominatedCourseStatus = new NominatedCourseStatus();
        nominatedCourseStatus.setCourseId(course.getCourseId());
        nomination.getNominatedCourses().add(nominatedCourseStatus);
        Employee manager = new Employee();
        manager.setEmpId("manager1");
        manager.setEmpName("Manager 1");
        employee.setEmpName("Employee 1");

        when(employeeService.getEmployee("emp1")).thenReturn(employee);
        when(employeeService.getEmployee("manager1")).thenReturn(manager);
        when(courseService.getCourseById(anyString())).thenReturn(course);
        when(employeeService.isPendingCoursePresent(anyString(), anyString())).thenReturn(false);
        when(employeeService.isApprovedCoursePresent(anyString(), anyString())).thenReturn(false);
        when(nominationRepository.save(any())).thenReturn(nomination);
        when(emailService.createPendingRequestEmailBody(anyString(), anyString(), anyString(), anyString(), anyString())).thenReturn("body");

        Nomination result = nominationService.createNomination(nomination, Month.JANUARY);

        assertNotNull(result);
        assertEquals(nomination.getNominationId(), result.getNominationId());
        assertFalse(result.getNominatedCourses().isEmpty());
        assertEquals(ApprovalStatus.PENDING, result.getNominatedCourses().get(0).getApprovalStatus());
    }

    @Test
    void testCreateNomination_NoAvailableCourses() {
        when(employeeService.getEmployee("emp1")).thenReturn(employee);

        Nomination result = nominationService.createNomination(nomination, Month.JANUARY);

        assertNull(result);
    }

    @Test
    void testUpdateNomination() {

        when(nominationRepository.findById("nomination1")).thenReturn(java.util.Optional.of(nomination));
        when(nominationRepository.save(any())).thenReturn(nomination);

        Nomination updatedNomination = new Nomination();
        updatedNomination.setCertifId(Collections.singletonList("updated_certif_id"));
        updatedNomination.setCourseSuggestions("updated_course_suggestions");

        Nomination result = nominationService.updateNomination("nomination1", updatedNomination);

        assertEquals(updatedNomination.getCertifId(), result.getCertifId());
        assertEquals(updatedNomination.getCourseSuggestions(), result.getCourseSuggestions());
    }

    @Test
    void testDeleteNomination() {
        nominationService.deleteNomination("nomination1");

        verify(nominationRepository, times(1)).deleteById("nomination1");
    }

    @Test
    void testTakeActionOnPendingRequest_Approve() {
        NominatedCourseStatus nominatedCourseStatus = new NominatedCourseStatus();
        nominatedCourseStatus.setCourseId("course1");
        nominatedCourseStatus.setApprovalStatus(ApprovalStatus.PENDING);

        nomination.getNominatedCourses().add(nominatedCourseStatus);

        when(nominationRepository.findById("nomination1")).thenReturn(java.util.Optional.of(nomination));
        when(employeeService.getEmployee("emp1")).thenReturn(employee);
        when(courseService.getCourseById("course1")).thenReturn(course);

        nominationService.takeActionOnPendingRequest("nomination1", "course1", "approve", Month.JANUARY);

        assertEquals(ApprovalStatus.APPROVED, nomination.getNominatedCourses().get(0).getApprovalStatus());
        verify(nominationRepository, times(1)).save(nomination);
    }

    @Test
    void testTakeActionOnPendingRequest_Reject() {
        NominatedCourseStatus nominatedCourseStatus = new NominatedCourseStatus();
        nominatedCourseStatus.setCourseId("course1");
        nominatedCourseStatus.setApprovalStatus(ApprovalStatus.PENDING);

        nomination.getNominatedCourses().add(nominatedCourseStatus);

        when(nominationRepository.findById("nomination1")).thenReturn(java.util.Optional.of(nomination));
        when(employeeService.getEmployee("emp1")).thenReturn(employee);
        when(courseService.getCourseById("course1")).thenReturn(course);

        nominationService.takeActionOnPendingRequest("nomination1", "course1", "reject", Month.JANUARY);

        assertEquals(ApprovalStatus.REJECTED, nomination.getNominatedCourses().get(0).getApprovalStatus());
        verify(nominationRepository, times(1)).save(nomination);
    }
}
