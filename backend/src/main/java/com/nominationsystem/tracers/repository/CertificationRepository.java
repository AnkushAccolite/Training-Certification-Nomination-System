package com.nominationsystem.tracers.repository;

import com.nominationsystem.tracers.models.Certification;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CertificationRepository extends MongoRepository<Certification, String> {
}
