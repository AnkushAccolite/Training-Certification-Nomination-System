package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.Nomination;
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
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NominationControllerTest {

    @Mock
    private NominationService nominationService;

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
        doNothing().when(nominationService).takeActionOnPendingRequest(anyString(), anyString(), anyString(), any(Month.class));

        nominationController.approvePendingRequest("approve", "nom1", "course1", Month.JANUARY);

        verify(nominationService, times(1)).takeActionOnPendingRequest("nom1", "course1", "approve", Month.JANUARY);
    }
}
