package com.nominationsystem.tracers.repository;

import com.nominationsystem.tracers.models.TC_Approval_Records;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TCApprovalRecordsRepository extends MongoRepository<TC_Approval_Records, String> {
}
