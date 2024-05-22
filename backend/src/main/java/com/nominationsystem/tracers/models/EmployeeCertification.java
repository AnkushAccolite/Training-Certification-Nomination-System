package com.nominationsystem.tracers.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeCertification {
    private ArrayList<String> pendingCertifications;
    private ArrayList<CertificationStatus> certifications;
}
