package com.nominationsystem.tracers.repository;

import com.nominationsystem.tracers.models.CoursesFAQ;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoursesFaqRepository extends MongoRepository<CoursesFAQ, String> {
    CoursesFAQ findByFaqId(String faqId);
}
