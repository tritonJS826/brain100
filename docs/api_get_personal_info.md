# User Personal Info API Documentation

## Endpoint: `/br-general/users/me/personal`

### Method
`GET`

### Auth Required
✅ Yes — Requires a valid `Authorization: Bearer <access_token>` header.

---

### Description
Retrieves the authenticated user's **personal details** and their latest **subscription plan**.

This endpoint combines user data and the most recent subscription entry to provide an overview of the user’s plan usage and remaining validity period.

---

### Request Headers

```
Authorization: Bearer <access_token>
```

---

### Example Request

```bash
curl -X GET http://localhost:8000/br-general/users/me/personal   -H "Authorization: Bearer <your_access_token>"
```

---

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | User’s registered email address |
| `name` | string | User’s display name |
| `role` | enum(`PATIENT`, `DOCTOR`) | User’s assigned role |
| `plan` | enum(`FREE`, `BASIC`) | Active subscription plan |
| `consultations_used` | int | Number of consultations already used |
| `consultations_included` | int | Total consultations provided in the plan |
| `days_to_end` | int | Number of days remaining until the subscription ends |

---

### Example Successful Response

```json
{
  "email": "test4545@gmail.com",
  "name": "test4545",
  "role": "PATIENT",
  "plan": "BASIC",
  "consultations_used": 2,
  "consultations_included": 5,
  "days_to_end": 23
}
```

---

### Example Response (No Active Subscription)

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "DOCTOR",
  "plan": "FREE",
  "consultations_used": 0,
  "consultations_included": 0,
  "days_to_end": 0
}
```

---

### Notes

- Returns default values (`FREE`, `0`, `0`, `0`) if no subscription exists.
- Useful for dashboards or account profile pages displaying personal data.
- Tokens should be refreshed if expired before calling this endpoint.

---

**Version:** 1.0.0  
**Last Updated:** 2025-10-05  
**Author:** br-general-python API Team
