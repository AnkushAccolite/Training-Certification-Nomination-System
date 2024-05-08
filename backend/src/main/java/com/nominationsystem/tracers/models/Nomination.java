package com.nominationsystem.tracers.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

@Getter
@Setter
@Document(collection = "Nomination")
public class Nomination {

    @Id
    private String nominationId;

    private String approvalStatus;

    private String empId;

    private String  courseId;

    private String certifId;

    private String managerId;

    private String nominationDate;

    private String courseSuggestions;
}
