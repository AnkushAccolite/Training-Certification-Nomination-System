package com.nominationsystem.tracers.models;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CertificationRequestsTemplate {

    String empId;
    String empName;
    List<Certification> pendingCertDetails;

}
