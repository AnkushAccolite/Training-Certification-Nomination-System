package com.nominationsystem.tracers.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "coursesFAQ")
public class CoursesFAQ {

    @Id
    private String faqId;

    private String question;

    private  String answer;

    private Boolean isDeleted=false;

    public CoursesFAQ(String question, String answer) {
        this.question = question;
        this.answer = answer;
    }
}
