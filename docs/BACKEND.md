# Backend API Error Contract

Customers and visits APIs return a stable JSON error body for validation failures and domain 404s.

## Shape

```json
{
  "code": "VALIDATION_FAILED",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/owners",
  "errors": [
    {
      "field": "telephone",
      "message": "Telephone must contain exactly 12 digits",
      "rejectedValue": "abc"
    }
  ]
}
```

## Fields

- `code`: stable machine-readable category.
- `status`: HTTP status code.
- `error`: HTTP reason phrase.
- `message`: human-readable summary.
- `path`: request path that failed.
- `errors`: field-level details for validation failures; empty for non-field errors.

## Codes

- `VALIDATION_FAILED`: request JSON was readable but one or more fields failed validation. The UI should render `errors[*].message` inline beside `errors[*].field`.
- `INVALID_REQUEST`: request JSON was malformed or could not be parsed. The UI may show `message` near the form.
- `NOT_FOUND`: requested owner, pet, or referenced domain resource was not found. The `errors` array is empty.

## Current Validation Messages

- Owners: `firstName`, `lastName`, `address`, `city`, and `telephone`; telephone must contain exactly 12 digits.
- Pets: `name`, `birthDate`, and `typeId`.
- Visits: `date` and `description`.
