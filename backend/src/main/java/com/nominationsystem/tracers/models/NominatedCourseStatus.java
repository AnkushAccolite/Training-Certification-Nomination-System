package com.nominationsystem.tracers.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NominatedCourseStatus {

    private String courseId;

    private String approvalStatus;

    public ApprovalStatus getApprovalStatus() {
        return ApprovalStatus.valueOf(approvalStatus);
    }

    public void setApprovalStatus(ApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus.name();
    }
}
