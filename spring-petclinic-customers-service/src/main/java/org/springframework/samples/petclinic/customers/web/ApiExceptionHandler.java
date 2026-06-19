package org.springframework.samples.petclinic.customers.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Comparator;
import java.util.List;

@RestControllerAdvice
class ApiExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        return build(HttpStatus.NOT_FOUND, "NOT_FOUND", ex.getMessage(), request.getRequestURI(), List.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<ApiError.FieldError> errors = ex.getBindingResult().getFieldErrors().stream()
            .sorted(Comparator.comparing(FieldError::getField))
            .map(error -> new ApiError.FieldError(error.getField(), error.getDefaultMessage(), error.getRejectedValue()))
            .toList();

        return build(HttpStatus.BAD_REQUEST, "VALIDATION_FAILED", "Validation failed", request.getRequestURI(), errors);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    ResponseEntity<ApiError> handleConstraintViolation(ConstraintViolationException ex, HttpServletRequest request) {
        List<ApiError.FieldError> errors = ex.getConstraintViolations().stream()
            .map(violation -> new ApiError.FieldError(fieldName(violation.getPropertyPath().toString()), violation.getMessage(), violation.getInvalidValue()))
            .sorted(Comparator.comparing(ApiError.FieldError::field))
            .toList();

        return build(HttpStatus.BAD_REQUEST, "VALIDATION_FAILED", "Validation failed", request.getRequestURI(), errors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<ApiError> handleUnreadableMessage(HttpMessageNotReadableException ex, HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", "Request body is malformed", request.getRequestURI(), List.of());
    }

    private ResponseEntity<ApiError> build(HttpStatus status, String code, String message, String path, List<ApiError.FieldError> errors) {
        return ResponseEntity
            .status(status)
            .body(new ApiError(code, status.value(), status.getReasonPhrase(), message, path, errors));
    }

    private String fieldName(String propertyPath) {
        int dotIndex = propertyPath.lastIndexOf('.');
        if (dotIndex < 0) {
            return propertyPath;
        }
        return propertyPath.substring(dotIndex + 1);
    }
}
