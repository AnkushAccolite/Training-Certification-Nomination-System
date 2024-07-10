package com.nominationsystem.tracers.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "courseFeedback")
public class CourseFeedback {

    @Id
    private String feedbackId;

    private String empId;

    private  String empName;

    private  String courseId;

    private int rating;

    private String comment;

}
