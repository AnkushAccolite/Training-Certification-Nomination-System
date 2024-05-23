package com.nominationsystem.tracers.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.text.SimpleDateFormat;
import java.time.Month;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CertificationStatus {
    private String certificationId;
    private String startDate=new SimpleDateFormat("dd-MM-yyyy").format(new Date());
    private String completionDate;
    private String status;
    private Integer attempt=1;
}
