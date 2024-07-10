package com.nominationsystem.tracers.models;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class CertificationsFAQTest {

    @Test
    public void testNoArgsConstructor() {
        // Given
        CertificationsFAQ faq = new CertificationsFAQ();

        // Then
        assertThat(faq).isNotNull();
        assertThat(faq.getFaqId()).isNull();
        assertThat(faq.getQuestion()).isNull();
        assertThat(faq.getAnswer()).isNull();
        assertThat(faq.getIsDeleted()).isFalse();
    }

    @Test
    public void testAllArgsConstructor() {
        // Given
        String faqId = "faq1";
        String question = "What is Certification X?";
        String answer = "Certification X is a certification for...";
        Boolean isDeleted = true;

        // When
        CertificationsFAQ faq = new CertificationsFAQ(faqId, question, answer, isDeleted);

        // Then
        assertThat(faq).isNotNull();
        assertThat(faq.getFaqId()).isEqualTo(faqId);
        assertThat(faq.getQuestion()).isEqualTo(question);
        assertThat(faq.getAnswer()).isEqualTo(answer);
        assertThat(faq.getIsDeleted()).isEqualTo(isDeleted);
    }

    @Test
    public void testConstructorWithQuestionAndAnswer() {
        // Given
        String question = "What is Certification Y?";
        String answer = "Certification Y is a certification for...";

        // When
        CertificationsFAQ faq = new CertificationsFAQ(question, answer);

        // Then
        assertThat(faq).isNotNull();
        assertThat(faq.getQuestion()).isEqualTo(question);
        assertThat(faq.getAnswer()).isEqualTo(answer);
        assertThat(faq.getIsDeleted()).isFalse();
    }

    @Test
    public void testSettersAndGetters() {
        // Given
        CertificationsFAQ faq = new CertificationsFAQ();
        String faqId = "faq2";
        String question = "What is Certification Z?";
        String answer = "Certification Z is a certification for...";
        Boolean isDeleted = true;

        // When
        faq.setFaqId(faqId);
        faq.setQuestion(question);
        faq.setAnswer(answer);
        faq.setIsDeleted(isDeleted);

        // Then
        assertThat(faq.getFaqId()).isEqualTo(faqId);
        assertThat(faq.getQuestion()).isEqualTo(question);
        assertThat(faq.getAnswer()).isEqualTo(answer);
        assertThat(faq.getIsDeleted()).isEqualTo(isDeleted);
    }
}
