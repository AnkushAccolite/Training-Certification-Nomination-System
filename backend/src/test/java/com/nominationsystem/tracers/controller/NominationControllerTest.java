package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.Employee;
import com.nominationsystem.tracers.models.Nomination;
import com.nominationsystem.tracers.service.EmployeeService;
import com.nominationsystem.tracers.service.NominationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.Month;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NominationControllerTest {

    @Mock
    private NominationService nominationService;

    @Mock
    private EmployeeService employeeService;

    @InjectMocks
    private EmployeeController employeeController;

    @InjectMocks
    private NominationController nominationController;

    private Nomination nomination;

    @BeforeEach
    public void setUp() {
        nomination = new Nomination();
        nomination.setId("nom1");
        nomination.setCourseId("course1");
        nomination.setEmployeeId("emp1");
    }

    @Test
    public void testGetEmployees_Success() {
        // Mocking the service method
        List<Employee> mockEmployees = Arrays.asList(
                new Employee(),
                new Employee()
        );
        when(employeeService.getAllEmployees()).thenReturn(mockEmployees);

        // Calling the controller method
        ResponseEntity<?> response = employeeController.getEmployees();

        // Assertions
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockEmployees, response.getBody());
    }


    @Test
    public void testGetNomination() {
        when(nominationService.getNomination(anyString())).thenReturn(nomination);

        ResponseEntity<Nomination> response = nominationController.getNomination("nom1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(nomination, response.getBody());
    }

    @Test
    public void testRemoveCourseFromAllNominations() {
        doNothing().when(nominationService).removeCourseFromAllNominations(anyString(), anyString());

        ResponseEntity<?> response = nominationController.removeCourseFromAllNominations("emp1", "course1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(nominationService, times(1)).removeCourseFromAllNominations("emp1", "course1");
    }

    @Test
    public void testGetAllNominations() {
        List<Nomination> nominations = new ArrayList<>();
        nominations.add(nomination);

        when(nominationService.getAllNominations()).thenReturn(nominations);

        ResponseEntity<List<Nomination>> response = nominationController.getAllNominations();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(nominations, response.getBody());
    }

    @Test
    public void testGetAllRequests() {
        List<Nomination> requests = new ArrayList<>();
        requests.add(nomination);

        when(nominationService.getAllRequests(anyString())).thenReturn(requests);

        ResponseEntity<List<Nomination>> response = nominationController.getAllRequests("manager1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(requests, response.getBody());
    }

    @Test
    public void testCreateNomination() {
        when(nominationService.createNomination(any(Nomination.class), any(Month.class))).thenReturn(nomination);

        ResponseEntity<Nomination> response = nominationController.createNomination(nomination, Month.JANUARY);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(nomination, response.getBody());
    }

    @Test
    public void testUpdateNomination() {
        when(nominationService.updateNomination(anyString(), any(Nomination.class))).thenReturn(nomination);

        ResponseEntity<Nomination> response = nominationController.updateNomination("nom1", nomination);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(nomination, response.getBody());
    }

    @Test
    public void testDeleteNomination() {
        doNothing().when(nominationService).deleteNomination(anyString());

        ResponseEntity<Void> response = nominationController.deleteNomination("nom1");

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(nominationService, times(1)).deleteNomination("nom1");
    }

    @Test
    public void testApprovePendingRequest() {
        // Mock the behavior of takeActionOnPendingRequest()
        when(nominationService.takeActionOnPendingRequest(anyString(), anyString(), anyString(), any(Month.class)))
                .thenReturn("updated");

        // Call the controller method
        nominationController.approvePendingRequest("approve", "nom1", "course1", Month.JANUARY);

        // Verify that the service method was called with the correct parameters
        verify(nominationService, times(1)).takeActionOnPendingRequest("nom1", "course1", "approve", Month.JANUARY);
    }

    @Test
    public void testApprovePendingRequestFromEmail() {
        when(nominationService.takeActionOnPendingRequest(anyString(), anyString(), anyString(), any(Month.class)))
                .thenReturn("updated");

        String response = nominationController.approvePendingRequestFromEmail("approve", "nom1", "course1", Month.JANUARY);

        assertEquals("<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "    <title>Email Action</title>"
                + "    <script>"
                + "        function closeCurrentTab() {"
                + "            window.close();"
                + "        }"
                + "    </script>"
                + "</head>"
                + "<body style='text-align:center;'>"
                + "    <p>Action has been taken for the course.</p>"
                + "    <button onclick='closeCurrentTab()'>You can close this tab</button>"
                + "    <script>"
                + "        setTimeout(function() {"
                + "            document.querySelector('button').click();"
                + "        }, 5000);"
                + "    </script>"
                + "</body>"
                + "</html>", response);
    }

    @Test
    public void testApprovePendingRequestFromEmailAlreadyTaken() {
        when(nominationService.takeActionOnPendingRequest(anyString(), anyString(), anyString(), any(Month.class)))
                .thenReturn("already_taken");

        String response = nominationController.approvePendingRequestFromEmail("approve", "nom1", "course1", Month.JANUARY);

        assertEquals("<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "    <title>Email Action</title>"
                + "    <script>"
                + "        function closeCurrentTab() {"
                + "            window.close();"
                + "        }"
                + "    </script>"
                + "</head>"
                + "<body style='text-align:center;'>"
                + "    <p>You have already taken the action for this course.</p>"
                + "    <button onclick='closeCurrentTab()'>You can close this tab</button>"
                + "    <script>"
                + "        setTimeout(function() {"
                + "            document.querySelector('button').click();"
                + "        }, 5000);"
                + "    </script>"
                + "</body>"
                + "</html>", response);
    }
}
