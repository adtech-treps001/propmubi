# QUICK START GUIDE
## Multi-Agent Development Setup for Propmubi

**Last Updated:** December 29, 2025
**Goal:** Get 5-10 AI coding agents working in parallel within 1 hour

---

## 🚀 IMMEDIATE ACTION PLAN

### Step 1: Initialize Git Repository (5 minutes)

```bash
cd c:\Personal\propmubi

# Initialize if not already done
git init
git branch -M master

# Create develop branch
git checkout -b develop

# Create .gitignore (already exists)
git add .gitignore README.md
git commit -m "chore: initial commit with project structure"

# Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/propmubi.git
git push -u origin master
git push -u origin develop
```

### Step 2: Start Infrastructure Services (10 minutes)

```bash
# From Windows PowerShell OR WSL Ubuntu

# Option A: Windows PowerShell
.\setup-local.ps1

# Option B: WSL Ubuntu (Recommended)
wsl
cd /mnt/c/Personal/propmubi
bash scripts/setup-wsl.sh
source venv/bin/activate

# Start all databases and infrastructure
docker-compose -f docker-compose.local.yml up -d

# Verify services are running
docker-compose -f docker-compose.local.yml ps

# Should see: postgres, mongodb, redis, elasticsearch, qdrant, minio, etc.
```

### Step 3: Assign Agents to Tasks (15 minutes)

**Parallel Track 1: HIGHEST PRIORITY (Start Immediately)**

| Agent | Tool | Task | Prompt File | Directory |
|-------|------|------|-------------|-----------|
| **Agent-1** | Cursor | Shared Domain Models | PARALLEL_AGENT_ORCHESTRATION.md → Shared-Domain | `packages/domain/` |
| **Agent-2** | Claude Code | Shared Common Libraries | PARALLEL_AGENT_ORCHESTRATION.md → Shared-Common | `common/` |
| **Agent-3** | Cline | Design System (Web) | AI_AGENT_PROMPTS.md → [FE-001] | `packages/design-system/` |

**Parallel Track 2: After Track 1 (30 min delay)**

| Agent | Tool | Task | Directory |
|-------|------|------|-----------|
| **Agent-4** | Copilot | API Gateway | `services/api-gateway/` |
| **Agent-5** | Kiro | Auth Service | `services/auth-service/` |
| **Agent-6** | Windsurf | User Service | `services/user-service/` |

**Parallel Track 3: Integration Services (Can start anytime)**

| Agent | Tool | Task | Directory |
|-------|------|------|-----------|
| **Agent-7** | Cursor | Payment Service | `services/payment-service/` |
| **Agent-8** | Claude Code | Communication Service | `services/communication-service/` |

**Parallel Track 4: Frontend Apps (After Design System)**

| Agent | Tool | Task | Directory |
|-------|------|------|-----------|
| **Agent-9** | Cline | Next.js Web App | `apps/web/` |
| **Agent-10** | Copilot | React Native Mobile | `apps/mobile/` |

---

## 📝 HOW TO ASSIGN AGENTS

### For Each Agent:

1. **Open the AI Coding Tool** (Cursor, Cline, Claude Code, etc.)

2. **Navigate to the Project Directory**
   ```bash
   cd c:\Personal\propmubi
   ```

3. **Copy the Specific Delta Context Prompt**
   - Open `PARALLEL_AGENT_ORCHESTRATION.md`
   - Find the section for your agent (e.g., "AGENT: Backend-1 (API Gateway)")
   - Copy the ENTIRE prompt block

4. **Paste to the AI Agent**
   - In Cursor: Open chat, paste prompt
   - In Claude Code: Paste prompt in command line
   - In Cline: Open task, paste prompt
   - In Copilot: Open chat panel, paste prompt

5. **Agent Starts Working**
   - Agent creates files ONLY in its assigned directory
   - Agent follows TDD (tests first)
   - Agent follows clean architecture
   - Agent commits to Git when done

6. **Monitor Progress**
   - Check `IMPLEMENTATION_PROGRESS_TRACKER.md`
   - Update task status manually or via script

---

## 🎯 EXAMPLE: Start First 3 Agents

### Agent-1: Shared Domain Models (Cursor)

```bash
# Open Cursor
cursor c:\Personal\propmubi

# In Cursor chat, paste this:
```

```
AGENT: Shared-Domain
PRIORITY: START FIRST (all other agents depend on this)

TASK: Define shared domain models and interfaces

YOUR EXCLUSIVE WRITE AREA:
packages/domain/
├─ src/
│  ├─ entities/
│  │  ├─ user.py
│  │  ├─ property.py
│  │  ├─ transaction.py
│  │  └─ lead.py
│  ├─ value_objects/
│  │  ├─ email.py
│  │  ├─ money.py
│  │  ├─ address.py
│  │  ├─ phone.py
│  │  └─ bhk_config.py
│  ├─ aggregates/
│  │  └─ property_listing.py
│  └─ interfaces/
│     └─ repositories/
│        ├─ user_repository.py
│        ├─ property_repository.py
│        └─ transaction_repository.py
└─ tests/

STRICT CONSTRAINTS:
- DO NOT create files outside packages/domain/
- Pure domain logic ONLY (no external dependencies like FastAPI, SQLAlchemy)
- Use Python dataclasses or Pydantic BaseModel
- Immutable value objects (frozen=True for dataclasses)
- Clear aggregate boundaries
- Repository interfaces ONLY (no implementations)

IMPLEMENTATION STEPS:

1. Create directory structure:
   mkdir -p packages/domain/src/{entities,value_objects,aggregates,interfaces/repositories}
   mkdir -p packages/domain/tests/{entities,value_objects}

2. Implement Value Objects FIRST (TDD):

   A. Email Value Object:
   ```python
   # tests/value_objects/test_email.py
   import pytest
   from src.value_objects.email import Email

   def test_valid_email():
       email = Email("test@example.com")
       assert email.value == "test@example.com"

   def test_invalid_email():
       with pytest.raises(ValueError):
           Email("invalid-email")
   ```

   ```python
   # src/value_objects/email.py
   from dataclasses import dataclass
   import re

   @dataclass(frozen=True)
   class Email:
       value: str

       def __post_init__(self):
           if not self._is_valid(self.value):
               raise ValueError(f"Invalid email: {self.value}")

       @staticmethod
       def _is_valid(email: str) -> bool:
           pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
           return re.match(pattern, email) is not None
   ```

   B. Money Value Object:
   ```python
   # src/value_objects/money.py
   from dataclasses import dataclass

   @dataclass(frozen=True)
   class Money:
       amount: float
       currency: str = "INR"

       def __post_init__(self):
           if self.amount < 0:
               raise ValueError("Amount cannot be negative")

       def __add__(self, other: 'Money') -> 'Money':
           if self.currency != other.currency:
               raise ValueError("Cannot add different currencies")
           return Money(self.amount + other.amount, self.currency)
   ```

   C. Address, Phone, BHKConfig value objects (similar pattern)

3. Implement Entities:

   A. User Entity:
   ```python
   # src/entities/user.py
   from dataclasses import dataclass
   from uuid import UUID, uuid4
   from datetime import datetime
   from ..value_objects.email import Email
   from ..value_objects.phone import Phone

   @dataclass
   class User:
       id: UUID
       email: Email
       phone: Phone
       full_name: str
       user_type: str  # "buyer", "seller", "agent", etc.
       is_active: bool = True
       created_at: datetime = None

       def __post_init__(self):
           if self.created_at is None:
               object.__setattr__(self, 'created_at', datetime.utcnow())

       def deactivate(self):
           object.__setattr__(self, 'is_active', False)

       def update_email(self, new_email: Email):
           object.__setattr__(self, 'email', new_email)
   ```

   B. Property Entity:
   ```python
   # src/entities/property.py
   from dataclasses import dataclass
   from uuid import UUID
   from typing import List
   from ..value_objects.money import Money
   from ..value_objects.address import Address

   @dataclass
   class Property:
       id: UUID
       name: str
       address: Address
       price: Money
       bhk_config: str
       area_sqft: float
       amenities: List[str]
       status: str  # "available", "sold", "under_construction"

       def is_available(self) -> bool:
           return self.status == "available"

       def update_price(self, new_price: Money):
           if new_price.amount <= 0:
               raise ValueError("Price must be positive")
           object.__setattr__(self, 'price', new_price)

       def mark_as_sold(self):
           object.__setattr__(self, 'status', 'sold')
   ```

4. Implement Repository Interfaces:

   ```python
   # src/interfaces/repositories/user_repository.py
   from abc import ABC, abstractmethod
   from typing import Optional, List
   from uuid import UUID
   from ...entities.user import User
   from ...value_objects.email import Email

   class UserRepository(ABC):
       @abstractmethod
       async def find_by_id(self, user_id: UUID) -> Optional[User]:
           pass

       @abstractmethod
       async def find_by_email(self, email: Email) -> Optional[User]:
           pass

       @abstractmethod
       async def save(self, user: User) -> User:
           pass

       @abstractmethod
       async def delete(self, user_id: UUID) -> bool:
           pass

       @abstractmethod
       async def find_all(self, limit: int = 100, offset: int = 0) -> List[User]:
           pass
   ```

5. Write Tests for All:
   - tests/value_objects/test_email.py
   - tests/value_objects/test_money.py
   - tests/value_objects/test_address.py
   - tests/entities/test_user.py
   - tests/entities/test_property.py

6. Run Tests:
   ```bash
   cd packages/domain
   pytest tests/ --cov=src --cov-report=term
   # Must achieve >= 90% coverage
   ```

7. Create package structure:
   ```python
   # src/__init__.py
   from .entities.user import User
   from .entities.property import Property
   from .value_objects.email import Email
   from .value_objects.money import Money
   # ... export all

   __all__ = ['User', 'Property', 'Email', 'Money', ...]
   ```

8. Git Workflow:
   ```bash
   git checkout -b feature/SHARED-domain-models

   # Create and test all files
   # ...

   git add packages/domain/
   git commit -m "feat(SHARED): implement domain models and value objects

   - Add User, Property, Transaction, Lead entities
   - Add Email, Money, Address, Phone value objects
   - Add repository interfaces
   - Tests: 92% coverage
   - Pure domain logic, no external dependencies"

   git push origin feature/SHARED-domain-models

   # Create PR
   gh pr create --title "feat(SHARED): Domain Models and Value Objects" \
     --body "Implements shared domain models for all microservices.

   ## Changes
   - Domain entities: User, Property, Transaction, Lead
   - Value objects: Email, Money, Address, Phone, BHKConfig
   - Repository interfaces

   ## Testing
   - Unit tests: 45 passed
   - Coverage: 92%

   ## Checklist
   - [x] Tests written first (TDD)
   - [x] No external dependencies
   - [x] Immutable value objects
   - [x] >= 90% coverage"
   ```

DELIVERABLES:
1. All domain entities (User, Property, Transaction, Lead)
2. All value objects (Email, Money, Address, Phone, BHKConfig)
3. Repository interfaces (UserRepository, PropertyRepository, etc.)
4. Unit tests with >= 90% coverage
5. Git commit with PR

START IMPLEMENTATION NOW. All microservices depend on this.
```

---

### Agent-2: Shared Common Libraries (Claude Code)

Open Claude Code terminal and paste the prompt from `PARALLEL_AGENT_ORCHESTRATION.md` → "AGENT: Shared-Common"

---

### Agent-3: Design System (Cline)

Open Cline and paste the prompt from `AI_AGENT_PROMPTS.md` → "[FE-001] Design System & Atomic Components"

---

## 📊 TRACK PROGRESS

### Real-time Progress Tracking

```bash
# View overall progress
cat IMPLEMENTATION_PROGRESS_TRACKER.md | grep "Status:"

# Update task status
# Edit IMPLEMENTATION_PROGRESS_TRACKER.md and change:
# - **Status:** ✗ Not Started
# to:
# - **Status:** ⧗ In Progress
# or:
# - **Status:** ✓ Complete
```

### Git Branches View
```bash
# See all feature branches
git branch -a

# See commits on a branch
git log feature/SVC-001-api-gateway --oneline

# See PR status
gh pr list
```

### Build Status
```bash
# If GitHub Actions set up
gh run list

# Watch a specific run
gh run watch
```

---

## ✅ SUCCESS CRITERIA

After 1 week with 10 agents working in parallel:

- [ ] All 3 shared packages complete (domain, common, design-system)
- [ ] 5+ backend services complete (api-gateway, auth, user, property, document)
- [ ] 2+ integration services complete (payment, communication)
- [ ] Web app foundation complete (with design system)
- [ ] Mobile app foundation complete
- [ ] All services have >= 85% test coverage
- [ ] All PRs reviewed and merged to `develop`
- [ ] Dev environment deployed and running

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue 1: Agent Creates Files in Wrong Directory

**Problem:** Agent-4 (API Gateway) creates files in `services/auth-service/`

**Solution:**
1. Stop the agent immediately
2. Delete incorrect files: `rm -rf services/auth-service/`
3. Re-paste the correct Delta Context prompt with emphasis on "YOUR EXCLUSIVE WRITE AREA"
4. Agent should create files ONLY in `services/api-gateway/`

### Issue 2: Merge Conflicts

**Problem:** Two agents modified the same file

**Solution:**
- This should NEVER happen if agents follow directory constraints
- If it does, review the conflict and choose the correct version
- Update agent prompts to be more strict about directory boundaries

### Issue 3: Agent Doesn't Follow TDD

**Problem:** Agent implements code first, then writes tests

**Solution:**
- Stop the agent
- Emphasize in prompt: "WRITE TESTS FIRST (TDD). The test must FAIL before you implement."
- Restart agent with stricter TDD instructions

### Issue 4: Tests Failing

**Problem:** Agent reports tests passing, but CI shows failures

**Solution:**
```bash
# Run tests locally
cd services/api-gateway
pytest tests/ --cov=src --cov-report=term

# If failing, ask agent to fix
# Paste the test output to agent with: "Fix these failing tests"
```

### Issue 5: Low Code Coverage

**Problem:** Coverage is 60%, target is 85%+

**Solution:**
- Ask agent: "Current coverage is 60%. Write additional tests to achieve 85%+ coverage. Focus on edge cases and error paths."

---

## 📚 REFERENCE DOCUMENTS

| Document | Purpose | When to Use |
|----------|---------|-------------|
| `IMPLEMENTATION_TASKS_DAG.md` | Complete task list with dependencies | Planning which tasks to assign |
| `IMPLEMENTATION_PROGRESS_TRACKER.md` | Detailed checklist for each task | Tracking progress, checking completion |
| `AI_AGENT_PROMPTS.md` | Ready-to-use prompts for each task | Copy-paste to agents |
| `PARALLEL_AGENT_ORCHESTRATION.md` | Agent assignment matrix, delta context | Understanding what each agent should do |
| `TECHNOLOGY_DECISIONS.md` | Tech stack and rationale | Understanding technology choices |

---

## 🎬 GETTING STARTED RIGHT NOW

### Option 1: Start with 3 Agents (Recommended)

```bash
# Agent 1: Shared Domain (Cursor)
cursor c:\Personal\propmubi
# Paste: PARALLEL_AGENT_ORCHESTRATION.md → Shared-Domain prompt

# Agent 2: Shared Common (Claude Code)
code c:\Personal\propmubi
# Paste: PARALLEL_AGENT_ORCHESTRATION.md → Shared-Common prompt

# Agent 3: Design System (Cline)
# Open Cline
# Paste: AI_AGENT_PROMPTS.md → [FE-001] prompt
```

### Option 2: Start with 10 Agents (Aggressive)

Assign all 10 agents from the "Parallel Track" tables above. All will work simultaneously.

---

## 📈 WEEKLY MILESTONES

### Week 1: Foundation
- [ ] Shared packages (domain, common, design-system)
- [ ] 3 backend services (API gateway, Auth, User)
- [ ] Development environment running

### Week 2: Core Services
- [ ] 6 more backend services
- [ ] 2 integration services
- [ ] Web app basic pages

### Week 3: AI/ML Services
- [ ] AI orchestration service
- [ ] ML model service
- [ ] Mobile app foundation

### Week 4: Testing & DevOps
- [ ] E2E test suite
- [ ] CI/CD pipelines
- [ ] Staging deployment

---

**START NOW:** Assign Agent-1, Agent-2, and Agent-3 to kick off parallel development!
