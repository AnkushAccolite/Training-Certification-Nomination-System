package com.nominationsystem.tracers.models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;

public class TC_Approval_RecordsTest {

    private TC_Approval_Records record;

    @BeforeEach
    public void setUp() {
        record = new TC_Approval_Records();
    }

    @Test
    public void testGettersAndSetters() {
        // Given
        String id = "id1";
        String empId = "emp1";
        ArrayList<String> certificationId = new ArrayList<>();
        certificationId.add("cert1");
        certificationId.add("cert2");
        String OS = "Windows";
        String device = "Other";
        String OSVersion = "10";
        String browser = "Chrome";
        String browserVersion = "125";
        String clientIP = "0:0:0:0:0:0:0:1";
        String dateTime = "2024-07-10 12:00:00";

        // When
        record.setId(id);
        record.setEmpId(empId);
        record.setCertificationId(certificationId);
        record.setOS(OS);
        record.setDevice(device);
        record.setOSVersion(OSVersion);
        record.setBrowser(browser);
        record.setBrowserVersion(browserVersion);
        record.setClientIP(clientIP);
        record.setDate_Time(dateTime);

        // Then
        assertThat(record.getId()).isEqualTo(id);
        assertThat(record.getEmpId()).isEqualTo(empId);
        assertThat(record.getCertificationId()).containsExactly("cert1", "cert2");
        assertThat(record.getOS()).isEqualTo(OS);
        assertThat(record.getDevice()).isEqualTo(device);
        assertThat(record.getOSVersion()).isEqualTo(OSVersion);
        assertThat(record.getBrowser()).isEqualTo(browser);
        assertThat(record.getBrowserVersion()).isEqualTo(browserVersion);
        assertThat(record.getClientIP()).isEqualTo(clientIP);
        assertThat(record.getDate_Time()).isEqualTo(dateTime);
    }

    @Test
    public void testCustomConstructor() {
        // Given
        String empId = "emp1";
        ArrayList<String> certificationId = new ArrayList<>();
        certificationId.add("cert1");
        certificationId.add("cert2");
        String OS = "Windows";
        String device = "Other";
        String OSVersion = "10";
        String browser = "Chrome";
        String browserVersion = "125";
        String clientIP = "0:0:0:0:0:0:0:1";

        // When
        TC_Approval_Records record = new TC_Approval_Records(empId, certificationId, OS, device, OSVersion, browser, browserVersion, clientIP);

        // Then
        assertThat(record).isNotNull();
        assertThat(record.getEmpId()).isEqualTo(empId);
        assertThat(record.getCertificationId()).containsExactly("cert1", "cert2");
        assertThat(record.getOS()).isEqualTo(OS);
        assertThat(record.getDevice()).isEqualTo(device);
        assertThat(record.getOSVersion()).isEqualTo(OSVersion);
        assertThat(record.getBrowser()).isEqualTo(browser);
        assertThat(record.getBrowserVersion()).isEqualTo(browserVersion);
        assertThat(record.getClientIP()).isEqualTo(clientIP);
        assertThat(record.getDate_Time()).isNotNull();
    }

    @Test
    public void testAllArgsConstructor() {
        // Given
        String empId = "emp1";
        ArrayList<String> certificationId = new ArrayList<>();
        certificationId.add("cert1");
        certificationId.add("cert2");
        String OS = "Windows";
        String device = "Other";
        String OSVersion = "10";
        String browser = "Chrome";
        String browserVersion = "125";
        String clientIP = "0:0:0:0:0:0:0:1";
        String date_Time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        // When
        TC_Approval_Records record = new TC_Approval_Records("id1", empId, certificationId, OS, device, OSVersion, browser, browserVersion, clientIP, date_Time);

        // Then
        assertThat(record).isNotNull();
        assertThat(record.getEmpId()).isEqualTo(empId);
        assertThat(record.getCertificationId()).containsExactly("cert1", "cert2");
        assertThat(record.getOS()).isEqualTo(OS);
        assertThat(record.getDevice()).isEqualTo(device);
        assertThat(record.getOSVersion()).isEqualTo(OSVersion);
        assertThat(record.getBrowser()).isEqualTo(browser);
        assertThat(record.getBrowserVersion()).isEqualTo(browserVersion);
        assertThat(record.getClientIP()).isEqualTo(clientIP);
        assertThat(record.getDate_Time()).isNotNull();
    }
}
