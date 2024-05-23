package com.nominationsystem.tracers.models;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CertificationReportTemplate {

    private String empId;
    private String empName;
    private List<String> certName = new ArrayList<>();
    private List<String> category = new ArrayList<>();
    private List<String> completionDate = new ArrayList<>();

}
