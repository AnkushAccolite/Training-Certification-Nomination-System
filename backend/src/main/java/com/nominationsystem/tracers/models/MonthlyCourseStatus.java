package com.nominationsystem.tracers.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Month;
import java.util.ArrayList;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyCourseStatus {

    private Month month;
    private ArrayList<String> bands;

}
