# 🏗️ ARCHITECTURE IMPROVEMENT ROADMAP: MVP to Enterprise Scale (Score 5.1 → 9+)

**Current Assessment**: 5.1/10 (MVP-to-Series-A Stage)
**Target**: 9+/10 (FAANG Enterprise-Ready)
**Timeline**: 6 months to full maturity

---

## 📊 CURRENT STATE ANALYSIS

### Scorecard Breakdown

| Dimension | Current | Target | Gap |
|-----------|---------|--------|-----|
| Architecture | 6/10 | 9/10 | Microservices decomposition |
| Code Quality | 7/10 | 9/10 | Linting, formatting, standards |
| Testing | 5/10 | 9/10 | Unit + Integration coverage |
| Security | 4/10 | 9/10 | Auth, secrets, CORS |
| Scalability | 4/10 | 9/10 | Database, caching, load balancing |
| DevOps | 3/10 | 9/10 | CI/CD, staging, monitoring |
| Observability | 2/10 | 9/10 | Logging, tracing, metrics |
| Documentation | 9/10 | 9/10 | ✅ Already excellent |
| Database | 5/10 | 9/10 | Persistence, migrations |
| API Design | 6/10 | 9/10 | Versioning, contracts |
| **Overall** | **5.1/10** | **9+/10** | **+3.9 points needed** |

---

## 🎯 IMPLEMENTATION TIERS

### TIER 1: IMMEDIATE (Weeks 1-4) - Score: 5.1 → 6.5
**Goal**: Production-blocking issues resolved
**Target Score**: 6.5/10
**Effort**: 160 hours (4 weeks × 40h)

### TIER 2: SHORT-TERM (Weeks 5-8) - Score: 6.5 → 7.8
**Goal**: Series A readiness
**Target Score**: 7.8/10
**Effort**: 160 hours (4 weeks × 40h)

### TIER 3: MEDIUM-TERM (Weeks 9-24) - Score: 7.8 → 9.2
**Goal**: Enterprise scale, FAANG-level architecture
**Target Score**: 9.2/10
**Effort**: 640 hours (16 weeks × 40h)

---

## 📋 TIER 1: IMMEDIATE FIXES (Weeks 1-4)

### 🔴 CRITICAL: Database Persistence Layer
**Priority**: P0 (Blocker)
**Impact**: +0.5 architecture, +0.8 database
**Effort**: 40 hours
**Status**: ❌ Not Started

#### Current Problem
```python
# apps/api/routers/agent.py
AGENTS = {}  # ❌ In-memory - data lost on restart
LISTINGS = []  # ❌ Not persisted

@router.get("/listings")
async def get_agent_listings():
    return LISTINGS  # ❌ Should query database
```

#### Required Changes

**1.1 Create Database Session Management**
```python
# apps/api/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/propmubi"
)

engine = create_async_engine(DATABASE_URL, echo=True, future=True)
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
```

**1.2 Implement Repository Pattern**
```python
# apps/api/repositories/agent_repository.py
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from apps.api.shared.domain.agent_models import Agent, AgentListing

class AgentRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_agent_by_id(self, agent_id: str) -> Agent:
        stmt = select(Agent).where(Agent.id == agent_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all_listings(self) -> list[AgentListing]:
        stmt = select(AgentListing)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def create_listing(self, listing: AgentListing) -> AgentListing:
        self.session.add(listing)
        await self.session.commit()
        await self.session.refresh(listing)
        return listing
```

**1.3 Update Routers to Use Repository**
```python
# apps/api/routers/agent.py
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from apps.api.database import get_db
from apps.api.repositories.agent_repository import AgentRepository

@router.get("/listings")
async def get_agent_listings(
    db: AsyncSession = Depends(get_db)
):
    repo = AgentRepository(db)
    listings = await repo.get_all_listings()
    return listings
```

**1.4 Add Alembic Migrations**
```bash
# Install Alembic
poetry add alembic

# Initialize
alembic init migrations

# Create migration
alembic revision --autogenerate -m "Add agents and listings tables"

# Apply
alembic upgrade head
```

#### Acceptance Criteria
- [ ] All routers use database instead of in-memory data
- [ ] Alembic migrations created for all tables
- [ ] Repository pattern implemented for: Agent, Lead, Project, Builder
- [ ] Connection pooling configured (max 20 connections)
- [ ] Database queries use async/await
- [ ] All existing tests updated and passing

#### Files to Modify
- `apps/api/routers/agent.py` (189 lines)
- `apps/api/routers/crm.py` (167 lines)
- `apps/api/routers/builder.py` (201 lines)
- `apps/api/routers/projects.py` (123 lines)
- Create: `apps/api/repositories/*.py` (5 files)
- Create: `apps/api/migrations/*.py` (Alembic)

---

### 🔴 CRITICAL: Security Hardening
**Priority**: P0 (Blocker)
**Impact**: +1.5 security
**Effort**: 32 hours
**Status**: ❌ Not Started

#### Current Vulnerabilities

**2.1 Hardcoded Credentials**
```python
# apps/api/routers/auth.py (Line 42)
if req.otp != "0000":  # ❌ SECURITY: Hardcoded OTP
    raise HTTPException(status_code=401)
```

**Fix**:
```python
# Use SMS provider (Twilio, AWS SNS)
import os
from twilio.rest import Client

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE = os.getenv("TWILIO_PHONE_NUMBER")

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

async def send_otp(phone: str) -> str:
    otp = generate_6_digit_otp()
    await store_otp_in_redis(phone, otp, ttl=300)  # 5 min expiry

    message = client.messages.create(
        body=f"Your PropMubi OTP is: {otp}",
        from_=TWILIO_PHONE,
        to=phone
    )
    return message.sid
```

**2.2 Open CORS Policy**
```python
# apps/api/main.py (Line 18)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ❌ SECURITY: Allows all origins
    allow_credentials=True,
)
```

**Fix**:
```python
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3005,http://localhost:3006"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
```

**2.3 JWT Validation Middleware**
```python
# apps/api/middleware/auth.py
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os

security = HTTPBearer()
JWT_SECRET = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"

async def verify_token(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Usage in routers
@router.get("/protected-resource")
async def protected(user: dict = Depends(verify_token)):
    return {"user_id": user["sub"]}
```

**2.4 Environment Variables Management**
```bash
# .env.example (template for team)
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/propmubi
REDIS_URL=redis://localhost:6379
JWT_SECRET_KEY=your-secret-key-here-change-in-production
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-twilio-token
ALLOWED_ORIGINS=http://localhost:3005,http://localhost:3006
```

```python
# apps/api/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    redis_url: str
    jwt_secret_key: str
    twilio_account_sid: str
    twilio_auth_token: str
    allowed_origins: list[str]

    class Config:
        env_file = ".env"

settings = Settings()
```

#### Acceptance Criteria
- [ ] All hardcoded credentials removed
- [ ] Environment variables for all secrets
- [ ] CORS restricted to specific origins
- [ ] JWT validation middleware implemented
- [ ] OTP via SMS provider (Twilio/AWS SNS)
- [ ] Rate limiting on auth endpoints (10 attempts/15min)
- [ ] Password hashing with bcrypt (cost factor 12)
- [ ] Refresh token rotation implemented

#### Files to Modify
- `apps/api/main.py` (CORS config)
- `apps/api/routers/auth.py` (OTP, JWT)
- Create: `apps/api/middleware/auth.py`
- Create: `apps/api/config.py`
- Create: `.env.example`
- Update: `docker-compose.yml` (remove hardcoded postgres creds)

---

### 🟡 HIGH: Centralized Error Handling
**Priority**: P1
**Impact**: +0.4 code quality, +0.3 API design
**Effort**: 16 hours
**Status**: ❌ Not Started

#### Current State
```python
# Inconsistent error responses across routers
@router.get("/agent/{agent_id}")
async def get_agent(agent_id: str):
    if agent_id not in AGENTS:
        raise HTTPException(status_code=403, detail="Unauthorized agent")
    # vs
    if lead["id"] == lead_id:
        raise HTTPException(status_code=404, detail="Lead not found")
```

#### Implementation

**3.1 Custom Exception Classes**
```python
# apps/api/exceptions.py
class PropMubiException(Exception):
    def __init__(self, message: str, error_code: str, status_code: int = 400):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        super().__init__(self.message)

class ResourceNotFoundError(PropMubiException):
    def __init__(self, resource: str, resource_id: str):
        super().__init__(
            message=f"{resource} with ID {resource_id} not found",
            error_code="RESOURCE_NOT_FOUND",
            status_code=404
        )

class UnauthorizedError(PropMubiException):
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(
            message=message,
            error_code="UNAUTHORIZED",
            status_code=401
        )

class ValidationError(PropMubiException):
    def __init__(self, field: str, message: str):
        super().__init__(
            message=f"Validation error for field '{field}': {message}",
            error_code="VALIDATION_ERROR",
            status_code=422
        )
```

**3.2 Global Exception Handler**
```python
# apps/api/middleware/error_handler.py
from fastapi import Request, status
from fastapi.responses import JSONResponse
from apps.api.exceptions import PropMubiException
import logging
import uuid

logger = logging.getLogger(__name__)

async def exception_handler(request: Request, exc: PropMubiException):
    correlation_id = str(uuid.uuid4())

    logger.error(
        f"Error {exc.error_code}: {exc.message}",
        extra={
            "correlation_id": correlation_id,
            "path": request.url.path,
            "method": request.method
        }
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.error_code,
                "message": exc.message,
                "correlation_id": correlation_id,
                "path": request.url.path
            }
        }
    )

# Register in main.py
from apps.api.middleware.error_handler import exception_handler
from apps.api.exceptions import PropMubiException

app.add_exception_handler(PropMubiException, exception_handler)
```

**3.3 Usage in Routers**
```python
# apps/api/routers/agent.py
from apps.api.exceptions import ResourceNotFoundError, UnauthorizedError

@router.get("/agent/{agent_id}")
async def get_agent(agent_id: str, db: AsyncSession = Depends(get_db)):
    repo = AgentRepository(db)
    agent = await repo.get_agent_by_id(agent_id)

    if not agent:
        raise ResourceNotFoundError("Agent", agent_id)

    return agent
```

#### Acceptance Criteria
- [ ] Custom exception classes for all error types
- [ ] Global exception handler middleware
- [ ] Structured error responses with correlation IDs
- [ ] All routers use custom exceptions
- [ ] Error logging with context (path, method, user_id)
- [ ] Frontend can parse error responses consistently

---

### 🟡 HIGH: Linting & Formatting
**Priority**: P1
**Impact**: +0.3 code quality
**Effort**: 8 hours
**Status**: ❌ Not Started

#### Implementation

**4.1 Python: Black + Ruff**
```bash
# Install
poetry add --group dev black ruff

# pyproject.toml
[tool.black]
line-length = 100
target-version = ['py311']
include = '\.pyi?$'

[tool.ruff]
line-length = 100
select = ["E", "F", "I", "N", "W"]
ignore = ["E501"]

[tool.ruff.per-file-ignores]
"__init__.py" = ["F401"]
```

```bash
# Run
black apps/api/
ruff check apps/api/ --fix
```

**4.2 JavaScript/TypeScript: Prettier + ESLint**
```bash
# Install
pnpm add -D prettier eslint @typescript-eslint/parser

# .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100
}

# .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn'
  }
}
```

**4.3 Pre-commit Hooks**
```bash
# Install
poetry add --group dev pre-commit

# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.9.1
    hooks:
      - id: black
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.0
    hooks:
      - id: ruff
        args: [--fix]
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.0.3
    hooks:
      - id: prettier
        files: \.(js|ts|tsx|json|css|md)$

# Setup
pre-commit install
```

#### Acceptance Criteria
- [ ] Black configured and run on all Python files
- [ ] Ruff configured and all issues fixed
- [ ] Prettier configured and run on all JS/TS files
- [ ] ESLint configured and all issues fixed
- [ ] Pre-commit hooks installed
- [ ] CI pipeline runs linters (GitHub Actions)

---

### 🟢 MEDIUM: Request/Response Logging
**Priority**: P2
**Impact**: +0.5 observability
**Effort**: 12 hours
**Status**: ❌ Not Started

#### Implementation

**5.1 Structured Logging**
```python
# apps/api/logging_config.py
import logging
import json
import sys
from datetime import datetime

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_obj = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
        }
        if hasattr(record, "correlation_id"):
            log_obj["correlation_id"] = record.correlation_id
        if hasattr(record, "user_id"):
            log_obj["user_id"] = record.user_id
        return json.dumps(log_obj)

handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(JSONFormatter())
logging.root.addHandler(handler)
logging.root.setLevel(logging.INFO)
```

**5.2 Request Logging Middleware**
```python
# apps/api/middleware/request_logger.py
import time
import uuid
from fastapi import Request
import logging

logger = logging.getLogger(__name__)

async def log_requests(request: Request, call_next):
    correlation_id = str(uuid.uuid4())
    request.state.correlation_id = correlation_id

    start_time = time.time()

    logger.info(
        f"Request started",
        extra={
            "correlation_id": correlation_id,
            "method": request.method,
            "path": request.url.path,
            "client_ip": request.client.host
        }
    )

    response = await call_next(request)

    duration = time.time() - start_time
    logger.info(
        f"Request completed",
        extra={
            "correlation_id": correlation_id,
            "status_code": response.status_code,
            "duration_ms": int(duration * 1000)
        }
    )

    response.headers["X-Correlation-ID"] = correlation_id
    return response

# Register in main.py
app.middleware("http")(log_requests)
```

#### Acceptance Criteria
- [ ] JSON structured logging
- [ ] Correlation IDs for all requests
- [ ] Request/response duration tracking
- [ ] User ID in logs (when authenticated)
- [ ] Log levels configured (DEBUG in dev, INFO in prod)
- [ ] Logs indexed in ELK/Loki (future)

---

## 📊 TIER 1 COMPLETION METRICS

### Before (Current)
- Database: In-memory mock data
- Security: Hardcoded credentials, open CORS
- Errors: Inconsistent HTTP exceptions
- Code Quality: No linting, mixed styles
- Logging: print() statements only

### After (Week 4)
- ✅ Database: Persistent with migrations
- ✅ Security: Environment variables, JWT validation
- ✅ Errors: Structured responses with correlation IDs
- ✅ Code Quality: Black + Ruff + Prettier + ESLint
- ✅ Logging: JSON structured with request tracing

### Score Impact
| Dimension | Before | After | Gain |
|-----------|--------|-------|------|
| Architecture | 6.0 | 6.5 | +0.5 |
| Code Quality | 7.0 | 7.3 | +0.3 |
| Security | 4.0 | 6.5 | +2.5 |
| Database | 5.0 | 7.0 | +2.0 |
| Observability | 2.0 | 4.0 | +2.0 |
| **Overall** | **5.1** | **6.5** | **+1.4** |

---

## 🎯 NEXT STEPS

After completing TIER 1, proceed to:
- **TIER 2 Document**: `01-TIER-2-SHORT-TERM.md` (Weeks 5-8)
- **Focus**: Caching, API versioning, frontend state, testing

---

**Document Status**: ✅ Complete
**Last Updated**: 2026-01-10
**Next Review**: After TIER 1 completion (Week 4)
