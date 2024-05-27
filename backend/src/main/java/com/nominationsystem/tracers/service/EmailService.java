package com.nominationsystem.tracers.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setText(body);
        message.setSubject(subject);

        this.mailSender.send(message);
    }

    public String createPendingRequestEmailBody(String managerId, String empId, String empName, String nominationList, String nominationType) {

        String companyName = "bounteous x Accolite";

        return String.format(
                """
                        Hi %s

                        You have a new approval request for the following nomination:

                        Employee ID: %s
                        Employee Name: %s

                        Nominated %s:
                                %s

                        Please review the request and provide your approval.

                        Regards
                        Teknow
                        %s""",
                managerId,
                empId,
                empName,
                nominationType,
                nominationList,
                companyName
        );
    }

    public  String createApprovalEmailBody(String empName, String nominationList, String nominationType) {

        String companyName = "bounteous x Accolite";

        return String.format(
                """
                        Hi %s
                        
                        Glad to inform you that your request for the following nomination has been approved.
                        
                        %s Name: %s
                        
                        You can now proceed with the course as planned.
                        
                        Best Regards
                        Teknow
                        %s""",
                empName,
                nominationType,
                nominationList,
                companyName
        );
    }

    public  String createRejectionEmailBody(String empName, String nominationList, String nominationType) {

        String companyName = "bounteous x Accolite";

        return String.format(
                """
                        Hi %s
                        
                        Regret!! Your request for the following nomination has been rejected.
                        
                        %s Name: %s
                        
                        Reach out to your manager or the HR department for further assistance.
                        
                        Regards
                        Teknow
                        %s""",
                empName,
                nominationType,
                nominationList,
                companyName
        );
    }
}
