package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.Nomination;
import com.nominationsystem.tracers.service.NominationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Month;
import java.util.List;

@RestController
@RequestMapping("/nomination")
public class NominationController {

    @Autowired
    private NominationService nominationService;

    @GetMapping("/{id}")
    public ResponseEntity<Nomination> getNomination(@PathVariable("id") String nominationId) {
        Nomination nomination = this.nominationService.getNomination(nominationId);
        return ResponseEntity.ok(nomination);
    }

    @GetMapping("/cancel")
    public ResponseEntity<?> removeCourseFromAllNominations(@RequestParam String empId, @RequestParam String courseId) {
        this.nominationService.removeCourseFromAllNominations(empId, courseId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<Nomination>> getAllNominations() {
        List<Nomination> nominations = this.nominationService.getAllNominations();
        return ResponseEntity.ok(nominations);
    }

    @GetMapping
    public ResponseEntity<List<Nomination>> getAllRequests(@RequestParam String managerId) {
        List<Nomination> requests = this.nominationService.getAllRequests(managerId);
        return ResponseEntity.ok(requests);
    }

    @PostMapping
    public ResponseEntity<Nomination> createNomination(@RequestBody Nomination nomination, @RequestParam Month month) {
        Nomination createdNomination = this.nominationService.createNomination(nomination, month);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNomination);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Nomination> updateNomination(@PathVariable("id") String nominationId,
                                                       @RequestBody Nomination nomination) {
        Nomination updatedNomination = this.nominationService.updateNomination(nominationId, nomination);
        return ResponseEntity.ok(updatedNomination);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNomination(@PathVariable("id") String nominationId) {
        this.nominationService.deleteNomination(nominationId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{approveOrRejectAction}")
    public void approvePendingRequest(@PathVariable("approveOrRejectAction") String action,
                                      @RequestParam String nominationId,
                                      @RequestParam String courseId,
                                      @RequestParam Month month) {
        this.nominationService.takeActionOnPendingRequest(nominationId, courseId, action, month);
    }

    @GetMapping("/email/{approveOrRejectAction}")
    @ResponseBody
    public String approvePendingRequestFromEmail(@PathVariable("approveOrRejectAction") String action,
                                                 @RequestParam String nominationId,
                                                 @RequestParam String courseId,
                                                 @RequestParam Month month) {
        String result = this.nominationService.takeActionOnPendingRequest(nominationId, courseId, action, month);

        if (result.equals("updated"))
            return "<!DOCTYPE html>"
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
                    + "</html>";

        return "<!DOCTYPE html>"
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
                + "</html>";
    }

}
