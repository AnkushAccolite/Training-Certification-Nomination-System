package com.nominationsystem.tracers.repository;

import com.mongodb.client.DistinctIterable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class CustomCourseRepositoryImpl implements CustomCourseRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<String> findDistinctDomains() {
        DistinctIterable<String> distinctDomains = mongoTemplate.getCollection("Course").distinct("domain", String.class);
        List<String> domainList = new ArrayList<>();
        for (String domain : distinctDomains) {
            domainList.add(domain);
        }

        return domainList;
    }
}
