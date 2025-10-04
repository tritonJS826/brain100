# 📄 Auth & User API Overview

This document describes the **authentication** and **user** endpoints provided by the backend.  
It is intended for frontend developers and other backend contributors.

---

## 🧰 1. Generate from terminal (recommended)

Run this in your Ubuntu shell:

```bash
python -c "import secrets; print(secrets.token_hex(64))"
```

```bash
<token_generated>
```

## 🗝️ 2. Put it in your .env

Inside your project’s root .env file:

```bash
JWT_SECRET_KEY=<token_generated>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=180 # 3 hours
REFRESH_TOKEN_EXPIRE_MINUTES=10080  # 7 days
```

## 🔐 Auth Endpoints (`/auth`)

All endpoints under `/auth` deal with **authentication and token management**.

### 1. `POST /auth/register`

- **Purpose**: Create a new user account and immediately log them in.
- **Request body**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongpassword123"
  }
  ```
- **Response**:
  ```json
  {
    "user": {
      "id": 1,
      "email": "user@example.com"
    },
    "tokens": {
      "access_token": "jwt_access_here",
      "refresh_token": "jwt_refresh_here",
      "token_type": "bearer"
    }
  }
  ```

---

### 2. `POST /auth/login`

- **Purpose**: Authenticate an existing user.
- **Request body** (form-data, `application/x-www-form-urlencoded`):
  ```
  username=<email>
  password=<password>
  ```
- **Response**: Same as `/auth/register`.

---

### 3. `POST /auth/refresh`

- **Purpose**: Rotate tokens when the access token expires.
- **Request body**:
  ```json
  {
    "access_token": "old_access_jwt",
    "refresh_token": "valid_refresh_jwt"
  }
  ```
- **Response**: New `{ user, tokens }` with **rotated refresh token**.

---

### 4. `POST /auth/logout`

- **Purpose**: Stateless logout.
- **Important**: The backend does not invalidate tokens.  
  The client (frontend or mobile app) must discard stored tokens.
- **Response**:
  ```json
  {
    "message": "Successfully logged out. Please discard your tokens on the client."
  }
  ```

---

## 👤 User Endpoints (`/users`)

All endpoints under `/users` deal with **user profile data**.

### 1. `GET /users/me`

- **Purpose**: Fetch the current logged-in user.
- **Auth**: Requires valid access token (or refresh token fallback).
- **Headers**:
  ```
  Authorization: Bearer <access_token>
  x-refresh-token: <refresh_token>   (optional, only needed if access expired)
  ```
- **Response**:
  ```json
  {
    "user": {
      "id": 1,
      "email": "user@example.com"
    },
    "tokens": {
      "access_token": "new_or_same_access",
      "refresh_token": "same_refresh",
      "token_type": "bearer"
    }
  }
  ```

---

## 🔑 Token Lifecycle

- **Access token**:
    - Short-lived (e.g. 2h).
    - Used in `Authorization: Bearer <token>` header.

- **Refresh token**:
    - Long-lived (e.g. 7 days).
    - Used to obtain new access tokens when they expire.
    - Sent in header `x-refresh-token` or via `/auth/refresh` endpoint.

- **Rotation rules**:
    - `/auth/refresh` → rotates both access and refresh tokens.
    - `/users/me` → refreshes **only the access token** (refresh stays the same).

---

## ⚡ Frontend Guidelines

- Always store **both tokens** (`access_token`, `refresh_token`) after login/register.
- For API calls:
    - Send `access_token` in the `Authorization` header:
      ```
      Authorization: Bearer <access_token>
      ```
    - If the access token is expired, also include the `x-refresh-token` header to allow automatic refresh:
      ```
      x-refresh-token: <refresh_token>
      ```
- If the backend responds with `"Token expired"` or `"Invalid token"`, call `/auth/refresh` with both tokens in the
  request body to get a new pair.
- On logout, clear both tokens from local storage — the backend is stateless.

---
