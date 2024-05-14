package com.nominationsystem.tracers.models;

import lombok.Getter;
import lombok.Setter;

import java.time.Month;

@Getter
@Setter
public class MonthlyCourseStatus {

    private Month month;

    private boolean activationStatus;
}
