package com.nominationsystem.tracers.repository;

import com.nominationsystem.tracers.models.CertificationsFAQ;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationsFaqRepository extends MongoRepository<CertificationsFAQ, String> {
    CertificationsFAQ findByFaqId(String faqId);
}

