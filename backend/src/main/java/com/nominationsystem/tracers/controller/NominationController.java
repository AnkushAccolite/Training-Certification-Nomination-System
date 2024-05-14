package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.Nomination;
import com.nominationsystem.tracers.service.NominationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/nomination")
public class NominationController {

    @Autowired
    private NominationService nominationService;

    @GetMapping("/{id}")
    public ResponseEntity<Nomination> getNomination(@PathVariable("id") String nominationId) {
        Nomination nomination = nominationService.getNomination(nominationId);
        return ResponseEntity.ok(nomination);
    }

    @GetMapping
    public ResponseEntity<List<Nomination>> getAllNominations() {
        List<Nomination> nominations = nominationService.getAllNominations();
        return ResponseEntity.ok(nominations);
    }

    @PostMapping
    public ResponseEntity<Nomination> createNomination(@RequestBody Nomination nomination) {
        Nomination createdNomination = nominationService.createNomination(nomination);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNomination);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Nomination> updateNomination(@PathVariable("id") String nominationId, @RequestBody Nomination nomination) {
        Nomination updatedNomination = nominationService.updateNomination(nominationId, nomination);
        return ResponseEntity.ok(updatedNomination);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNomination(@PathVariable("id") String nominationId) {
        nominationService.deleteNomination(nominationId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{approveOrRejectAction}")
    public void approvePendingRequest(@PathVariable("approveOrRejectAction") String action,
                                      @RequestParam String nominationId,
                                      @RequestParam String courseName) {
        nominationService.takeActionOnPendingRequest(nominationId, courseName, action);
    }

}
