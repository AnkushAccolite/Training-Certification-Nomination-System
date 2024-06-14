package com.nominationsystem.tracers.models;


//OS	'Windows'
//Device	'Other'
//OSVersion	'10'
//BrowserVersion	'125'
//ClientIP	'0:0:0:0:0:0:0:1'
//Browser	'Chrome'


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import ua_parser.Client;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "T&C_Approval_Records")
public class TC_Approval_Records {

    @Id
    private String id;

    private String empId;
    private ArrayList<String> certificationId;
    private String OS;
    private String Device;
    private String OSVersion;
    private String Browser;
    private String BrowserVersion;
    private String ClientIP;
    private String Date_Time= LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

    public TC_Approval_Records(String empId, ArrayList<String> certificationId, String OS, String device, String OSVersion, String browser, String browserVersion, String clientIP) {
        this.empId = empId;
        this.certificationId = certificationId;
        this.OS = OS;
        Device = device;
        this.OSVersion = OSVersion;
        Browser = browser;
        BrowserVersion = browserVersion;
        ClientIP = clientIP;
    }
}
