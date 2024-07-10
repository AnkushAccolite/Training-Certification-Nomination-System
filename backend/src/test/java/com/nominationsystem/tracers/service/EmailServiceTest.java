package com.nominationsystem.tracers.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    private MimeMessage mimeMessage;

    @BeforeEach
    public void setUp() {
        mimeMessage = mock(MimeMessage.class);
    }

    @Test
    public void testSendEmail() throws MessagingException {
        String toEmail = "test@example.com";
        String subject = "Test Subject";
        String body = "Test Body";

        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendEmail(toEmail, subject, body);

        verify(mailSender, times(1)).createMimeMessage();
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    public void testSendEmailAsync() throws MessagingException {
        String toEmail = "test@example.com";
        String subject = "Test Subject";
        String body = "Test Body";

        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendEmailAsync(toEmail, subject, body);

        verify(mailSender, times(1)).createMimeMessage();
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    public void testCreatePendingRequestEmailBody() {
        String managerName = "Manager";
        String empId = "123";
        String empName = "Employee";
        String nominationList = "Nomination List";
        String nominationType = "Certification";

        String result = emailService.createPendingRequestEmailBody(managerName, empId, empName, nominationList, nominationType);
        String expected = String.format(
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
                managerName, empId, empName, nominationType, nominationList, "bounteous x Accolite");

        assertEquals(expected, result);
    }

    @Test
    public void testCreateApprovalEmailBody() {
        String empName = "Employee";
        String nominationList = "Nomination List";
        String nominationType = "Certification";

        String result = emailService.createApprovalEmailBody(empName, nominationList, nominationType);
        String expected = String.format(
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
                empName, nominationType, nominationList, "bounteous x Accolite");

        assertEquals(expected, result);
    }

    @Test
    public void testCreateRejectionEmailBody() {
        String empName = "Employee";
        String nominationList = "Nomination List";
        String nominationType = "Certification";

        String result = emailService.createRejectionEmailBody(empName, nominationList, nominationType);
        String expected = String.format(
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
                empName, nominationType, nominationList, "bounteous x Accolite");

        assertEquals(expected, result);
    }
}

