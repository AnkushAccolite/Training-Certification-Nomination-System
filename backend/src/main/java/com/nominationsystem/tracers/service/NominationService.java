package com.nominationsystem.tracers.service;

import com.nominationsystem.tracers.models.Nomination;
import com.nominationsystem.tracers.repository.EmployeeRepository;
import com.nominationsystem.tracers.repository.NominationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NominationService {

    @Autowired
    private NominationRepository nominationRepository;

    //cange to EmployeeService
    private EmployeeRepository employeeRepository;

    public Nomination getNomination(String nominationId) {
        return nominationRepository.findById(nominationId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
    }

    public List<Nomination> getAllNominations() {
        return nominationRepository.findAll();
    }

    public Nomination createNomination(Nomination nomination) {
        nomination.setManagerId(employeeRepository.findManagerIdByEmpId(nomination.getEmpId()));

        return nominationRepository.save(nomination);
    }

    public Nomination updateNomination(String nominationId, Nomination updatedNomination) {
        Nomination existingNomination = getNomination(nominationId);

        if(updatedNomination.getApprovalStatus() != null) {
            existingNomination.setApprovalStatus(updatedNomination.getApprovalStatus());
        }
        if(updatedNomination.getCourses() != null) {
            existingNomination.setCourses(updatedNomination.getCourses());
        }
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
}
