package com.nominationsystem.tracers.repository;

import com.nominationsystem.tracers.models.CourseFeedback;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseFeedbackRepository extends MongoRepository<CourseFeedback, String> {
}
