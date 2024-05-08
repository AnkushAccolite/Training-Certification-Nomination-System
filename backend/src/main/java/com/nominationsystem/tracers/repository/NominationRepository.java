package com.nominationsystem.tracers.repository;

import com.nominationsystem.tracers.models.Nomination;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NominationRepository extends MongoRepository<Nomination, String> {
}
