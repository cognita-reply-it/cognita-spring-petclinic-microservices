package org.springframework.samples.petclinic.customers.web;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record OwnerRequest(@NotBlank(message = "First name is required") String firstName,
                           @NotBlank(message = "Last name is required") String lastName,
                           @NotBlank(message = "Address is required") String address,
                           @NotBlank(message = "City is required") String city,
                           @NotBlank(message = "Telephone is required")
                           @Pattern(regexp = "\\d{12}", message = "Telephone must contain exactly 12 digits")
                           String telephone
) {
}
