package com.nominationsystem.tracers.models;


import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Getter
@Setter
@Document(collection = "certificationFeedback")
public class CertificationFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String feedbackId;

    private String empId;

    private  String empName;

    private  String certificationId;

    private int rating;

    private String comment;
}