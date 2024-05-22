package com.nominationsystem.tracers.repository;

import com.nominationsystem.tracers.models.CertificationFeedback;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CertificationFeedbackRepository extends MongoRepository<CertificationFeedback, String> {
}
