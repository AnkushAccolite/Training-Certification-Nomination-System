package com.nominationsystem.tracers.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nominationsystem.tracers.models.CertificationsFAQ;
import com.nominationsystem.tracers.models.CoursesFAQ;
import com.nominationsystem.tracers.repository.CertificationsFaqRepository;
import com.nominationsystem.tracers.repository.CoursesFaqRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)

public class FaqControllerTest {

    @Mock
    private CoursesFaqRepository coursesFaqRepository;

    @Mock
    private CertificationsFaqRepository certificationsFaqRepository;

    @InjectMocks
    private FaqController faqController;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(faqController).build();
    }

    @Test
    public void testGetCoursesFaq() throws Exception {
        List<CoursesFAQ> faqs = new ArrayList<>();
        CoursesFAQ faq1 = new CoursesFAQ("1", "What is Java?", "Java is a programming language.", false);
        CoursesFAQ faq2 = new CoursesFAQ("2", "What is Spring?", "Spring is a Java framework.", false);
        faqs.add(faq1);
        faqs.add(faq2);

        when(coursesFaqRepository.findAll()).thenReturn(faqs);

        mockMvc.perform(get("/faq/courses"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].faqId").value("1"))
                .andExpect(jsonPath("$[0].question").value("What is Java?"))
                .andExpect(jsonPath("$[0].answer").value("Java is a programming language."))
                .andExpect(jsonPath("$[1].faqId").value("2"))
                .andExpect(jsonPath("$[1].question").value("What is Spring?"))
                .andExpect(jsonPath("$[1].answer").value("Spring is a Java framework."));

        verify(coursesFaqRepository, times(1)).findAll();
    }

    @Test
    public void testAddCoursesFaq() throws Exception {
        CoursesFAQ faqToAdd = new CoursesFAQ(null, "What is JUnit?", "JUnit is a unit testing framework.", false);
        String faqJson = objectMapper.writeValueAsString(faqToAdd);

        mockMvc.perform(post("/faq/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(faqJson))
                .andExpect(status().isOk());

        verify(coursesFaqRepository, times(1)).save(any(CoursesFAQ.class));
    }

    @Test
    public void testDeleteCoursesFaq() throws Exception {
        CoursesFAQ faqToDelete = new CoursesFAQ("1", "What is Java?", "Java is a programming language.", false);

        when(coursesFaqRepository.findByFaqId("1")).thenReturn(faqToDelete);

        mockMvc.perform(get("/faq/courses/delete")
                        .param("faqId", "1"))
                .andExpect(status().isOk());

        faqToDelete.setIsDeleted(true);

        verify(coursesFaqRepository, times(1)).save(faqToDelete);
    }

    @Test
    public void testEditCoursesFaq() throws Exception {
        CoursesFAQ faqToUpdate = new CoursesFAQ("1", "What is Java?", "Java is a programming language.", false);
        CoursesFAQ updatedFaq = new CoursesFAQ("1", "What is Java?", "Java is a high-level programming language.", false);
        String faqJson = objectMapper.writeValueAsString(updatedFaq);

        when(coursesFaqRepository.findByFaqId("1")).thenReturn(faqToUpdate);

        mockMvc.perform(put("/faq/courses/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(faqJson))
                .andExpect(status().isOk());

        verify(coursesFaqRepository, times(1)).save(faqToUpdate);
    }

    @Test
    public void testGetCertificationsFaq() throws Exception {
        List<CertificationsFAQ> faqs = new ArrayList<>();
        CertificationsFAQ faq1 = new CertificationsFAQ("1", "What is Java Certification?", "Java Certification is a certification for Java programming.", false);
        CertificationsFAQ faq2 = new CertificationsFAQ("2", "What is Spring Certification?", "Spring Certification is a certification for Spring framework.", false);
        faqs.add(faq1);
        faqs.add(faq2);

        when(certificationsFaqRepository.findAll()).thenReturn(faqs);

        mockMvc.perform(get("/faq/certifications"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].faqId").value("1"))
                .andExpect(jsonPath("$[0].question").value("What is Java Certification?"))
                .andExpect(jsonPath("$[0].answer").value("Java Certification is a certification for Java programming."))
                .andExpect(jsonPath("$[1].faqId").value("2"))
                .andExpect(jsonPath("$[1].question").value("What is Spring Certification?"))
                .andExpect(jsonPath("$[1].answer").value("Spring Certification is a certification for Spring framework."));

        verify(certificationsFaqRepository, times(1)).findAll();
    }

    @Test
    public void testAddCertificationsFaq() throws Exception {
        CertificationsFAQ faqToAdd = new CertificationsFAQ(null, "What is AWS Certification?", "AWS Certification is a certification for Amazon Web Services.", false);
        String faqJson = objectMapper.writeValueAsString(faqToAdd);

        mockMvc.perform(post("/faq/certifications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(faqJson))
                .andExpect(status().isOk());

        verify(certificationsFaqRepository, times(1)).save(any(CertificationsFAQ.class));
    }

    @Test
    public void testDeleteCertificationsFaq() throws Exception {
        CertificationsFAQ faqToDelete = new CertificationsFAQ("1", "What is Java Certification?", "Java Certification is a certification for Java programming.", false);

        when(certificationsFaqRepository.findByFaqId("1")).thenReturn(faqToDelete);

        mockMvc.perform(get("/faq/certifications/delete")
                        .param("faqId", "1"))
                .andExpect(status().isOk());

        faqToDelete.setIsDeleted(true);

        verify(certificationsFaqRepository, times(1)).save(faqToDelete);
    }

    @Test
    public void testEditCertificationsFaq() throws Exception {
        CertificationsFAQ faqToUpdate = new CertificationsFAQ("1", "What is Java Certification?", "Java Certification is a certification for Java programming.", false);
        CertificationsFAQ updatedFaq = new CertificationsFAQ("1", "What is Java Certification?", "Java Certification is a professional certification for Java programming.", false);
        String faqJson = objectMapper.writeValueAsString(updatedFaq);

        when(certificationsFaqRepository.findByFaqId("1")).thenReturn(faqToUpdate);

        mockMvc.perform(put("/faq/certifications/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(faqJson))
                .andExpect(status().isOk());

        verify(certificationsFaqRepository, times(1)).save(faqToUpdate);
    }
}
