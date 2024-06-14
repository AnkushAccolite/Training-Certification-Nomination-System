package com.nominationsystem.tracers.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    public void sendEmail(String toEmail, String subject, String body) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, "utf-8");
            message.setTo(toEmail);
            message.setText(body, true);
            message.setSubject(subject);

            this.mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            logger.error("Unable to send email: {}", e.getMessage());
        }
    }

    @Async
    public void sendEmailAsync(String toEmail, String subject, String body) {
        sendEmail(toEmail, subject, body);
    }

    public String createPendingRequestEmailBody(String managerName, String empId, String empName, String nominationList, String nominationType) {

        String companyName = "bounteous x Accolite";

        return String.format(
                """
                        <html>
                        <body>
                            <p>Hi %s</p>
                            <p>You have a new approval request for the following nomination:</p>
                            <p><b>Employee ID:</b> %s<br>
                            <b>Employee Name:</b> %s</p>
                            <p>Please review the request and provide your approval:</p>
                            <p><a href="https://training-certification-nomination-system.vercel.app/course-requests"
                            style="background-color: blue; color: white; padding: 10px; text-decoration: none; margin-right: 10px;">Review</a></p><br>
                            <p><b>Nominated %s:</b></p>
                            <pre>%s</pre><br>
                            <p>Regards<br>Teknow<br>%s</p>
                        </body>
                        </html>""",
                managerName,
                empId,
                empName,
                nominationType,
                nominationList,
                companyName
        );
    }

    public String createApprovalEmailBody(String empName, String nominationList, String nominationType) {

        String companyName = "bounteous x Accolite";

        return String.format(
                """
                        <html>
                        <body>
                        <p>Hi %s</p>
                        <p>Glad to inform you that your request for the following nomination has been approved.</p>
                        <p>%s Name: %s</p>
                        <p>You can now proceed with the course as planned.</p>
                        <p>Best Regards<br>
                        Teknow<br>
                        %s</p>
                        </body>
                        </html>""",
                empName,
                nominationType,
                nominationList,
                companyName
        );
    }

    public String createRejectionEmailBody(String empName, String nominationList, String nominationType) {

        String companyName = "bounteous x Accolite";

        return String.format(
                """
                        <html>
                        <body>
                        <p>Hi %s</p>
                        <p>Regret!! Your request for the following nomination has been rejected.</p>
                        <p>%s Name: %s</p>
                        <p>Reach out to your manager or the HR department for further assistance.</p>
                        <p>Regards<br>
                        Teknow<br>
                        %s</p>
                        </body>
                        </html>""",
                empName,
                nominationType,
                nominationList,
                companyName
        );
    }

}
