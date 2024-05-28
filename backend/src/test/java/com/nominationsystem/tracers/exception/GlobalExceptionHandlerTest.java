package com.nominationsystem.tracers.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class GlobalExceptionHandlerTest {

    @Test
    public void testHandleValidationException() {
        // Given
        GlobalExceptionHandler handler = new GlobalExceptionHandler();
        MethodArgumentNotValidException ex = new MethodArgumentNotValidException(null,
                createBindingResult("Field error message"));

        // When
        ResponseEntity<String> responseEntity = handler.handleValidationException(ex);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertEquals("Validation error: Field error message", responseEntity.getBody());
    }

    private BindingResult createBindingResult(String errorMessage) {
        BindingResult bindingResult = new org.springframework.validation.BeanPropertyBindingResult(null, null);
        bindingResult.addError(new FieldError("objectName", "fieldName", errorMessage));
        return bindingResult;
    }
}
