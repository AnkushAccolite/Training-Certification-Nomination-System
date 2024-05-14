package com.nominationsystem.tracers.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NominatedCourseStatus {

    private String courseName;

    private String approvalStatus;

    public ApprovalStatus getApprovalStatus() {
        return ApprovalStatus.valueOf(approvalStatus);
    }

    public void setApprovalStatus(ApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus.name();
    }
}
