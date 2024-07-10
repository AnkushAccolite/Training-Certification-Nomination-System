package com.nominationsystem.tracers.models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class CoursesFAQTest {

    private CoursesFAQ coursesFAQ;

    @BeforeEach
    public void setUp() {
        coursesFAQ = new CoursesFAQ();
    }

    @Test
    public void testNoArgsConstructor() {
        assertThat(coursesFAQ).isNotNull();
        assertThat(coursesFAQ.getFaqId()).isNull();
        assertThat(coursesFAQ.getQuestion()).isNull();
        assertThat(coursesFAQ.getAnswer()).isNull();
        assertThat(coursesFAQ.getIsDeleted()).isFalse();
    }

    @Test
    public void testAllArgsConstructor() {
        // Given
        String faqId = "1";
        String question = "What is Java?";
        String answer = "Java is a programming language.";

        // When
        CoursesFAQ faq = new CoursesFAQ(faqId, question, answer, true);

        // Then
        assertThat(faq.getFaqId()).isEqualTo(faqId);
        assertThat(faq.getQuestion()).isEqualTo(question);
        assertThat(faq.getAnswer()).isEqualTo(answer);
        assertThat(faq.getIsDeleted()).isTrue();
    }

    @Test
    public void testGettersAndSetters() {
        // Given
        String faqId = "1";
        String question = "What is Spring Boot?";
        String answer = "Spring Boot is a framework for building microservices.";

        // When
        coursesFAQ.setFaqId(faqId);
        coursesFAQ.setQuestion(question);
        coursesFAQ.setAnswer(answer);
        coursesFAQ.setIsDeleted(true);

        // Then
        assertThat(coursesFAQ.getFaqId()).isEqualTo(faqId);
        assertThat(coursesFAQ.getQuestion()).isEqualTo(question);
        assertThat(coursesFAQ.getAnswer()).isEqualTo(answer);
        assertThat(coursesFAQ.getIsDeleted()).isTrue();
    }

    @Test
    public void testConstructorWithQuestionAndAnswer() {
        // Given
        String question = "What is MongoDB?";
        String answer = "MongoDB is a NoSQL database.";

        // When
        CoursesFAQ faq = new CoursesFAQ(question, answer);

        // Then
        assertThat(faq.getFaqId()).isNull();
        assertThat(faq.getQuestion()).isEqualTo(question);
        assertThat(faq.getAnswer()).isEqualTo(answer);
        assertThat(faq.getIsDeleted()).isFalse();
    }
}
