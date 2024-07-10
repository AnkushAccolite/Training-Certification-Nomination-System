package com.nominationsystem.tracers.security.jwt;

import jakarta.servlet.ServletException;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.WriteListener;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthEntryPointJwtTest {

    @InjectMocks
    private AuthEntryPointJwt authEntryPointJwt;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private AuthenticationException authException;

    private ByteArrayOutputStream byteArrayOutputStream;
    private ServletOutputStream servletOutputStream;

    @BeforeEach
    public void setUp() throws IOException {
        byteArrayOutputStream = new ByteArrayOutputStream();
        servletOutputStream = new ServletOutputStream() {
            @Override
            public boolean isReady() {
                return false;
            }

            @Override
            public void setWriteListener(WriteListener listener) {

            }

            @Override
            public void write(int b) throws IOException {
                byteArrayOutputStream.write(b);
            }
        };
        when(response.getOutputStream()).thenReturn(servletOutputStream);
    }

    @Test
    public void testCommence() throws IOException, ServletException {
        when(request.getServletPath()).thenReturn("/test/path");
        when(authException.getMessage()).thenReturn("Unauthorized");

        authEntryPointJwt.commence(request, response, authException);
        verify(response, times(1)).setContentType(MediaType.APPLICATION_JSON_VALUE);
        verify(response, times(1)).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }
}
