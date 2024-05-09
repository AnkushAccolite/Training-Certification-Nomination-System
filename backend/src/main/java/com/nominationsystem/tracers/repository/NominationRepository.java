package com.nominationsystem.tracers.repository;

import com.nominationsystem.tracers.models.Nomination;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NominationRepository extends MongoRepository<Nomination, String> {
}
