package com.nominationsystem.tracers.payload.response;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

public class MessageResponseTest {

    @Test
    public void testNoArgsConstructor() {
        MessageResponse messageResponse = new MessageResponse();

        assertNull(messageResponse.getMessage());
    }

    @Test
    public void testAllArgsConstructor() {
        // Given
        String messageContent = "Test message";

        // When
        MessageResponse messageResponse = new MessageResponse(messageContent);

        // Then
        assertEquals(messageContent, messageResponse.getMessage());
    }

    @Test
    public void testSetterAndGetMessage() {
        // Given
        MessageResponse messageResponse = new MessageResponse("");
        String messageContent = "New test message";

        // When
        messageResponse.setMessage(messageContent);

        // Then
        assertEquals(messageContent, messageResponse.getMessage());
    }
}
