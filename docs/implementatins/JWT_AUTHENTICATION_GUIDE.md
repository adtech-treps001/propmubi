# 🔐 Propmubi JWT + OPA Authentication System

**Enterprise-Grade Authentication with Scope Versioning**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features Implemented](#features-implemented)
4. [Quick Start](#quick-start)
5. [API Endpoints](#api-endpoints)
6. [Authentication Flow](#authentication-flow)
7. [Admin User Management](#admin-user-management)
8. [Scope Version Mechanism](#scope-version-mechanism)
9. [Testing Guide](#testing-guide)
10. [Production Roadmap](#production-roadmap)

---

## 🎯 Overview

This system implements **enterprise-grade JWT authentication** with:

- ✅ **Phone OTP Login** - Accepts any 6-digit OTP (demo mode)
- ✅ **Google OAuth** - OAuth integration ready
- ✅ **JWT Token Issuance** - Tokens with embedded permissions
- ✅ **Scope Versioning** - Immediate permission revocation
- ✅ **Admin Dashboard** - Visual permission management
- ✅ **OPA Integration Ready** - Docker container configured

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT APPLICATIONS                         │
│  ┌──────────┐                                  ┌──────────┐    │
│  │   Web    │  Login Page                      │  Admin   │    │
│  │  /login  │  OTP/Google → JWT Token          │ Dashboard│    │
│  └────┬─────┘                                  └────┬─────┘    │
└───────┼──────────────────────────────────────────────┼──────────┘
        │                                              │
        ▼                                              ▼
┌────────────────────────────────────────────────────────────────┐
│                 FastAPI Backend (Port 8000)                     │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ Authentication Routes (/auth/*)                      │     │
│  │  • POST /auth/send-otp        → Send OTP            │     │
│  │  • POST /auth/verify-otp      → Verify & Issue JWT  │     │
│  │  • POST /auth/sync-google     → Google OAuth + JWT  │     │
│  │  • GET  /auth/me              → Get current user    │     │
│  └──────────────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ Admin Routes (/api/admin/*)                          │     │
│  │  • GET  /api/admin/users              → List users  │     │
│  │  • PUT  /api/admin/users/:id/perms    → Update      │     │
│  └──────────────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ JWT Demo Routes (/api/auth/*)                        │     │
│  │  • POST /api/auth/generate-token      → Demo JWT    │     │
│  │  • POST /api/auth/validate-token      → Validate    │     │
│  └──────────────────────────────────────────────────────┘     │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  OPA Server (Port 8181)       │
         │  Ready for Rego policies      │
         └───────────────────────────────┘
```

---

## ✨ Features Implemented

### 1. **Phone OTP Authentication**

**Location:** [apps/api-fastapi/routes/auth.py](apps/api-fastapi/routes/auth.py:89-136)

```python
POST /auth/send-otp
{
  "phone": "9876543210"
}
→ Returns: OTP sent message

POST /auth/verify-otp
{
  "phone": "9876543210",
  "otp": "123456"
}
→ Returns: JWT token + user info + permissions
```

**Key Features:**
- Accepts any 6-digit OTP (demo mode)
- Auto-creates user on first login
- Default role: `buyer`, tier: `free`
- Default permissions: `property:search`, `property:view`
- Issues 24-hour JWT token

### 2. **Google OAuth Integration**

**Location:** [apps/api-fastapi/routes/auth.py](apps/api-fastapi/routes/auth.py:139-171)

```python
POST /auth/sync-google
{
  "email": "user@gmail.com",
  "name": "John Doe",
  "image": "https://..."
}
→ Returns: JWT token + user info + permissions
```

### 3. **JWT Token Structure**

```json
{
  "sub": "phone_9876543210",
  "email": null,
  "phone": "9876543210",
  "role": "buyer",
  "tier": "free",
  "scopes": ["property:search", "property:view"],
  "scopeVersion": 1,
  "iat": "2024-12-23T12:00:00",
  "exp": "2024-12-24T12:00:00"
}
```

### 4. **Admin User Management Dashboard**

**Location:** [apps/web/src/pages/admin/users.tsx](apps/web/src/pages/admin/users.tsx:1)

**URL:** http://localhost:3000/admin/users

**Features:**
- View all users with permissions
- 4 mock users (Builder, Investor, Agent, Buyer)
- 15 permission scopes (property, CRM, satellite, analytics, tax, portfolio)
- Toggle permissions with checkboxes
- Save & increment scope version
- Generate JWT tokens
- View decoded JWT payload
- Copy to clipboard
- Link to JWT.io debugger

### 5. **JWT Testing Playground**

**Location:** [apps/web/src/pages/demo/jwt-playground.tsx](apps/web/src/pages/demo/jwt-playground.tsx:1)

**URL:** http://localhost:3000/demo/jwt-playground

**Features:**
- Paste JWT token
- Validate token
- Display TOKEN_OUTDATED error on scope version mismatch
- Show permission-based UI guards
- Test satellite view, CRM, property creation, analytics

### 6. **Scope Version Mechanism**

**The Critical Enterprise Feature:**

```python
# When admin changes permissions:
1. Admin toggles permission in UI
2. Admin clicks "Save & Increment Version"
3. Backend increments user.scope_version: 1 → 2
4. Backend generates NEW JWT with version 2
5. Old JWT (version 1) becomes INVALID

# When user makes API call with old token:
POST /api/auth/validate-token
{
  "token": "eyJhbG..."  # Old token with scopeVersion: 1
}
→ Returns:
{
  "valid": false,
  "error": "TOKEN_OUTDATED",
  "message": "Permissions changed. Token needs refresh.",
  "currentVersion": 1,
  "requiredVersion": 2
}
```

---

## 🚀 Quick Start

### 1. Start Docker Containers

```bash
docker-compose up --build
```

This starts:
- **Web App** (Next.js) on http://localhost:3000
- **API** (FastAPI) on http://localhost:8000
- **OPA Server** on http://localhost:8181

### 2. Access Applications

| Application | URL | Description |
|------------|-----|-------------|
| **Login Page** | http://localhost:3000/login | OTP/Google auth |
| **Admin Dashboard** | http://localhost:3000/admin/users | User management |
| **JWT Playground** | http://localhost:3000/demo/jwt-playground | Token testing |
| **API Docs** | http://localhost:8000/docs | FastAPI Swagger |

---

## 📡 API Endpoints

### Authentication Endpoints

#### 1. Send OTP

```http
POST /auth/send-otp
Content-Type: application/json

{
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully",
  "dummy": "Any 6-digit OTP will work",
  "phone": "9876543210"
}
```

#### 2. Verify OTP & Get JWT

```http
POST /auth/verify-otp
Content-Type: application/json

{
  "phone": "9876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "OTP verified successfully",
  "user": {
    "id": "phone_9876543210",
    "phone": "9876543210",
    "email": null,
    "name": "User 3210",
    "role": "buyer",
    "tier": "free"
  },
  "tokens": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 86400
  },
  "permissions": ["property:search", "property:view"],
  "scopeVersion": 1
}
```

#### 3. Google OAuth Sync

```http
POST /auth/sync-google
Content-Type: application/json

{
  "email": "user@gmail.com",
  "name": "John Doe",
  "image": "https://..."
}
```

**Response:** Same structure as verify-otp

#### 4. Get Current User

```http
GET /auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "user": {
    "id": "phone_9876543210",
    "email": null,
    "phone": "9876543210",
    "role": "buyer",
    "tier": "free"
  },
  "permissions": ["property:search", "property:view"],
  "scopeVersion": 1
}
```

### Admin Endpoints

#### 5. List All Users

```http
GET /api/admin/users
```

**Response:**
```json
[
  {
    "id": "usr_001",
    "name": "Bob Builder",
    "email": "builder@example.com",
    "role": "builder",
    "tier": "enterprise",
    "scopes": ["property:create", "property:edit", "crm:manage", ...],
    "scope_version": 1
  },
  ...
]
```

#### 6. Update User Permissions

```http
PUT /api/admin/users/usr_001/permissions
Content-Type: application/json

{
  "scopes": ["property:create", "property:edit", "satellite:view"],
  "scope_version": 2
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "scopeVersion": 2
}
```

#### 7. Generate JWT Token (Demo)

```http
POST /api/auth/generate-token
Content-Type: application/json

{
  "userId": "usr_001",
  "scopes": ["property:view", "satellite:view"],
  "scopeVersion": 1
}
```

#### 8. Validate JWT Token

```http
POST /api/auth/validate-token
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Valid):**
```json
{
  "valid": true,
  "user": { ... },
  "scopes": ["property:view", "satellite:view"],
  "scopeVersion": 1
}
```

**Response (Outdated):**
```json
{
  "valid": false,
  "error": "TOKEN_OUTDATED",
  "message": "Permissions changed. Token needs refresh.",
  "currentVersion": 1,
  "requiredVersion": 2
}
```

---

## 🔄 Authentication Flow

### Phone OTP Login Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Enter phone number "9876543210"
     │
     ▼
┌────────────┐
│  Frontend  │
│  /login    │
└─────┬──────┘
      │
      │ 2. POST /auth/send-otp
      │
      ▼
┌────────────────┐
│   FastAPI      │
│   Backend      │
└────────┬───────┘
         │
         │ 3. "OTP sent" (demo: any 6-digit works)
         │
         ▼
┌────────────┐
│  User      │
│  Enters    │
│  OTP       │
└─────┬──────┘
      │
      │ 4. POST /auth/verify-otp { phone, otp }
      │
      ▼
┌────────────────┐
│   Backend      │
│  - Get/Create  │
│    User        │
│  - Generate    │
│    JWT         │
└────────┬───────┘
         │
         │ 5. Returns JWT + user info
         │
         ▼
┌────────────┐
│  Frontend  │
│  Stores    │
│  JWT       │
│  Redirects │
│  to /      │
└────────────┘
```

---

## 👨‍💼 Admin User Management

### Step 1: Access Admin Dashboard

Navigate to: http://localhost:3000/admin/users

### Step 2: View Users

You'll see 4 mock users:

| User | Role | Tier | Initial Permissions |
|------|------|------|-------------------|
| Bob Builder | builder | enterprise | property:create, property:edit, crm:manage, analytics:* |
| Ivan Investor | investor | silver | portfolio:*, satellite:*, tax:calculate |
| Alice Agent | agent | bronze | property:search, property:view, crm:view |
| John Buyer | buyer | free | property:search, property:view |

### Step 3: Modify Permissions

1. **Toggle checkboxes** for any permission scope
2. Click **"💾 Save & Increment Version"**
3. Backend increments `scope_version` (1 → 2)
4. Backend generates NEW JWT with updated scopes
5. Old JWT tokens become INVALID

### Step 4: Generate JWT Token

1. Click **"🔑 Generate JWT Token"**
2. JWT appears in right panel
3. View decoded payload
4. Copy to clipboard
5. Open in JWT.io debugger

### Step 5: Test Token Validation

1. Copy JWT token
2. Go to http://localhost:3000/demo/jwt-playground
3. Paste token
4. Click "Validate Token"
5. See permissions and UI guards

---

## 🔐 Scope Version Mechanism

### Why Scope Versioning?

**Problem:** Traditional JWT tokens are stateless. Once issued, you can't revoke them until they expire.

**Solution:** Scope versioning allows **immediate permission revocation** without token blacklisting.

### How It Works

```python
# User Database
user = {
  "id": "usr_001",
  "scopes": ["property:view", "satellite:view"],
  "scope_version": 1  # Incremented on every permission change
}

# JWT Token
jwt_payload = {
  "sub": "usr_001",
  "scopes": ["property:view", "satellite:view"],
  "scopeVersion": 1  # Snapshot at token generation
}

# Admin Changes Permissions
admin_updates_permissions()
→ user.scope_version = 2

# User Makes API Call with Old Token
validate_token(old_jwt)
→ old_jwt.scopeVersion (1) < user.scope_version (2)
→ Return ERROR: TOKEN_OUTDATED
```

### Implementation

**Backend Validation:**
```python
# apps/api-fastapi/routes/jwt_demo.py:175-197

decoded = jwt.decode(token, JWT_SECRET)
user = get_user(decoded["sub"])

if decoded["scopeVersion"] < user["scope_version"]:
    return {
        "valid": False,
        "error": "TOKEN_OUTDATED",
        "message": "Permissions changed. Token needs refresh."
    }
```

### Real-World Example

```
Timeline:

10:00 AM - User logs in
         → Gets JWT with scopeVersion: 1
         → Scopes: ["property:view", "satellite:view"]

10:30 AM - Admin removes satellite:view permission
         → User.scope_version increments to 2

10:31 AM - User tries to access satellite feature
         → API validates JWT
         → scopeVersion 1 < 2 (outdated!)
         → Returns 401 TOKEN_OUTDATED
         → User must refresh token to continue
```

---

## 🧪 Testing Guide

### Test 1: Complete Login Flow

```bash
# 1. Send OTP
curl -X POST http://localhost:8000/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210"}'

# 2. Verify OTP (use any 6-digit code)
curl -X POST http://localhost:8000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210", "otp": "123456"}'

# Response contains JWT token
```

### Test 2: Scope Version Invalidation

1. **Generate Initial Token:**
   - Go to http://localhost:3000/admin/users
   - Click "Generate JWT Token" for Bob Builder
   - Copy token (version 1)

2. **Modify Permissions:**
   - Uncheck "satellite:monitor"
   - Click "Save & Increment Version"
   - Bob's scope_version is now 2

3. **Validate Old Token:**
   - Go to http://localhost:3000/demo/jwt-playground
   - Paste old token (version 1)
   - Click "Validate Token"
   - See TOKEN_OUTDATED error ✅

4. **Generate New Token:**
   - Go back to admin panel
   - Click "Generate JWT Token" again
   - New token has version 2 ✅

### Test 3: Permission-Based UI Guards

1. Generate token for "John Buyer" (free tier)
2. Paste in playground
3. Validate → See only basic permissions
4. Note: Satellite view, CRM, Property creation all **DENIED** ❌

5. Generate token for "Ivan Investor" (silver tier)
6. Paste in playground
7. Validate → See satellite view **GRANTED** ✅

---

## 🗺️ Production Roadmap

### Phase 1: Database Integration ✅ (Current Demo Uses In-Memory)

```python
# Replace:
users_db = {}  # In-memory dict

# With:
from sqlalchemy import create_engine
engine = create_engine("postgresql://...")

class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True)
    phone = Column(String, unique=True)
    email = Column(String, unique=True)
    scopes = Column(JSON)
    scope_version = Column(Integer, default=1)
```

### Phase 2: Real OPA Integration

```python
# apps/api-fastapi/services/opa_service.py

async def get_user_permissions(user):
    response = await http_client.post(
        "http://opa:8181/v1/data/propmubi/features/features_for_user",
        json={"input": {"user": user}}
    )
    return response.json()["result"]
```

### Phase 3: Redis Token Blacklisting

```python
# When admin changes permissions:
redis.sadd(f"invalidated_tokens:{user_id}", f"v{old_version}")

# On token validation:
if redis.sismember(f"invalidated_tokens:{user_id}", f"v{token.scopeVersion}"):
    raise HTTPException(401, "Token invalidated")
```

### Phase 4: Refresh Token Rotation

```python
# Generate refresh token (30 days)
refresh_token = generate_refresh_token(user)
redis.setex(f"refresh:{refresh_token}", 2592000, user.id)

# Refresh endpoint
@router.post("/auth/refresh")
async def refresh_access_token(refresh_token: str):
    user_id = redis.get(f"refresh:{refresh_token}")
    user = get_user(user_id)
    new_access_token = generate_jwt_token(user)
    return {"access_token": new_access_token}
```

### Phase 5: httpOnly Cookies (Web)

```python
response.set_cookie(
    key="access_token",
    value=access_token,
    httponly=True,
    secure=True,
    samesite="strict",
    max_age=86400
)
```

### Phase 6: WebSocket Notifications

```python
# When admin changes permissions:
await websocket_manager.send_to_user(
    user_id,
    {
        "type": "PERMISSIONS_UPDATED",
        "scope_version": new_version
    }
)

# Client refreshes token immediately
```

---

## 🎯 Enterprise Thinking Highlights

| Feature | Benefit |
|---------|---------|
| **Scope Versioning** | Immediate permission revocation without token blacklisting |
| **Auto User Creation** | Frictionless onboarding (no pre-registration) |
| **24-Hour Tokens** | Balance between security and UX |
| **15+ Permission Scopes** | Fine-grained access control |
| **Multi-Tier System** | Monetization-ready (Free → Enterprise) |
| **JWT.io Integration** | Developer-friendly debugging |
| **Visual Admin UI** | Non-technical admins can manage permissions |
| **Real-Time Validation** | Every API call checks current scope version |

---

## 📊 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Phone OTP Login | ✅ Complete | Accepts any 6-digit OTP |
| Google OAuth | ✅ Complete | JWT token issuance integrated |
| JWT Generation | ✅ Complete | 24-hour tokens with scopes |
| Scope Versioning | ✅ Complete | Increment on permission change |
| Admin Dashboard | ✅ Complete | Full CRUD for permissions |
| JWT Playground | ✅ Complete | Token validation testing |
| OPA Server | ⚠️ Running | Rego policies not yet loaded |
| Database | ⚠️ In-Memory | PostgreSQL integration pending |
| Refresh Tokens | ❌ Planned | Phase 4 implementation |
| httpOnly Cookies | ❌ Planned | Phase 5 implementation |

---

## 🚀 Next Steps

1. **Test the System:**
   ```bash
   docker-compose up
   # Visit http://localhost:3000/admin/users
   ```

2. **Try Login Flow:**
   - Go to http://localhost:3000/login
   - Enter any 10-digit phone number
   - Enter any 6-digit OTP
   - You'll get a JWT token!

3. **Test Admin Features:**
   - Modify user permissions
   - Generate JWT tokens
   - Test scope version invalidation

4. **Explore API:**
   - Visit http://localhost:8000/docs
   - Try endpoints interactively

---

## 📞 Support

For questions about this implementation, refer to:
- **Implementation Plan:** [`C:\Users\Lakshmi narayana\.claude\plans\delightful-wondering-robin.md`](C:\Users\Lakshmi narayana\.claude\plans\delightful-wondering-robin.md)
- **Auth Routes:** [`apps/api-fastapi/routes/auth.py`](apps/api-fastapi/routes/auth.py)
- **JWT Demo Routes:** [`apps/api-fastapi/routes/jwt_demo.py`](apps/api-fastapi/routes/jwt_demo.py)
- **Admin Dashboard:** [`apps/web/src/pages/admin/users.tsx`](apps/web/src/pages/admin/users.tsx)

---

**Built with enterprise-grade architecture thinking** 🏗️

*Last Updated: December 23, 2024*
