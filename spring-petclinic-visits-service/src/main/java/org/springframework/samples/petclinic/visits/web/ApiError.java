package org.springframework.samples.petclinic.visits.web;

import java.util.List;

record ApiError(
    String code,
    int status,
    String error,
    String message,
    String path,
    List<FieldError> errors
) {

    ApiError {
        errors = List.copyOf(errors);
    }

    record FieldError(
        String field,
        String message,
        Object rejectedValue
    ) {
    }
}
