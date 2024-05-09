package com.nominationsystem.tracers.models;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Document(collection = "Nomination")
public class Nomination {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String nominationId;

    private String approvalStatus;

    private String empId;

    private List<String> courses;

    private List<String> certifId;

    private String managerId;

    private String nominationDate = new SimpleDateFormat("dd-MM-yyyy").format(new Date());

    private String courseSuggestions;

    public ApprovalStatus getApprovalStatus() {
        return ApprovalStatus.valueOf(approvalStatus);
    }

    public void setApprovalStatus(ApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus.name();
    }
}
