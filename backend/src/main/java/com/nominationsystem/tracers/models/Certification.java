package com.nominationsystem.tracers.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

@Getter
@Setter
@Document(collection = "Certification")
public class Certification {

    @Id
    private String certiId;

    private String name;

    private Integer duration;

    private Double price;

    private String category;
}
