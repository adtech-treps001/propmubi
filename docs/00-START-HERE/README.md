# 🚀 START HERE - PropMubi Trust OS (Real Estate Transaction Operating System)

**"We didn’t digitize real estate. We removed ambiguity from it."**

---

## 📍 Critical Rules for All Agents

### **MUST READ BEFORE STARTING**

```
┌─────────────────────────────────────────────────────────────┐
│              AGENT DEVELOPMENT RULES (NON-NEGOTIABLE)        │
│                                                              │
│  1. READ ASSIGNED DOCUMENTATION FIRST                       │
│     - Your tasks are in 06-AGENTS/AGENT-{YOUR-NAME}/        │
│     - Read ALL referenced documents before coding           │
│     - Never guess or hallucinate requirements               │
│                                                              │
│  2. FOLLOW THE GOLDEN RULE                                  │
│     "If it's not in the documentation, ASK first"           │
│     - Never make assumptions                                │
│     - Document all decisions                                │
│     - Update docs when adding features                      │
│                                                              │
│  3. CODE IN YOUR ASSIGNED DIRECTORY ONLY                    │
│     - Stay within your exclusive write area                 │
│     - Never modify other agents' code                       │
│     - Use shared packages via imports only                  │
│                                                              │
│  4. TEST-DRIVEN DEVELOPMENT (TDD) MANDATORY                 │
│     - Write tests BEFORE implementation                     │
│     - Test must FAIL before you write code                  │
│     - Minimum 85% code coverage                             │
│     - Run tests before committing                           │
│                                                              │
│  5. COMMIT & PUSH FREQUENTLY                                │
│     - Commit after each completed task                      │
│     - Use conventional commit messages                      │
│     - Push to your feature branch                           │
│     - Create PR when task complete                          │
│                                                              │
│  6. NO HALLUCINATIONS                                       │
│     - Use exact schemas from documentation                  │
│     - Use exact API endpoints from API_OVERVIEW.md          │
│     - Use exact database schemas from SERVICE_CATALOG.md    │
│     - Copy-paste code examples, don't recreate              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗺️ Documentation Structure (Your Roadmap)

### **00-START-HERE** (You are here)
- This README - Start here every time
- Project overview and context

### **01-PRODUCT**
- `PRD.md` - Product Requirements Document
- `FEATURES.md` - Complete feature list
- `USER_STORIES.md` - User stories and acceptance criteria

**Who needs this**: All agents (read first)
**Purpose**: Understand WHAT we're building and WHY

---

### **02-ARCHITECTURE**
- `SYSTEM_ARCHITECTURE.md` - High-level system design
- `DATA_ARCHITECTURE.md` - Database design and schemas
- `API_ARCHITECTURE.md` - API design patterns
- `INFRASTRUCTURE.md` - Cloud and DevOps setup

**Who needs this**: Backend agents, DevOps agents, Architects
**Purpose**: Understand HOW the system is structured

---

### **03-DESIGN**
- `UI_DESIGN_SYSTEM.md` - Design tokens, colors, typography
- `COMPONENT_LIBRARY.md` - Reusable UI components
- `SCREENS.md` - Screen-by-screen designs
- `UX_FLOWS.md` - User journey flows

**Who needs this**: Frontend agents (Mobile & Web)
**Purpose**: Understand HOW it should look and feel

---

### **04-IMPLEMENTATION**
- `DEVELOPMENT_GUIDE.md` - **⭐ CRITICAL: Setup and workflows**
- `API_OVERVIEW.md` - **⭐ CRITICAL: Complete API documentation**
- `SERVICE_CATALOG.md` - **⭐ CRITICAL: All microservices details**
- `DEPLOYMENT_GUIDE.md` - Deployment procedures

**Who needs this**: ALL agents (reference continuously)
**Purpose**: HOW to implement features step-by-step

---

### **05-TESTING**
- `TEST_STRATEGY.md` - Testing approach
- `TEST_CASES.md` - Specific test scenarios
- `E2E_TESTS.md` - End-to-end test flows

**Who needs this**: All agents (testing is mandatory)
**Purpose**: HOW to test your implementation

---

### **06-AGENTS**
- `AGENT-MOB/` - Mobile app agent tasks
- `AGENT-WEB/` - Web app agent tasks
- `AGENT-BE/` - Backend services agent tasks
- `AGENT-DT/` - Digital Twin agent tasks
- `AGENT-AI/` - AI/ML agent tasks
- `AGENT-INFRA/` - Infrastructure agent tasks

**Who needs this**: YOUR SPECIFIC AGENT DIRECTORY
**Purpose**: YOUR exact tasks with step-by-step instructions

---

### **09-STANDARDS**
- `CODING_STANDARDS.md` - Code style and conventions
- `GIT_WORKFLOW.md` - Branch strategy and commits
- `API_STANDARDS.md` - API design standards
- `DATABASE_STANDARDS.md` - Database naming conventions
- `SECURITY_STANDARDS.md` - Security best practices

**Who needs this**: All agents (enforce consistency)
**Purpose**: HOW to write consistent, quality code

---

## 🎯 Quick Start by Role

### For Mobile App Agent (AGENT-MOB)

```bash
# 1. Read documentation in this order:
01-PRODUCT/PRD.md
02-ARCHITECTURE/SYSTEM_ARCHITECTURE.md
03-DESIGN/UI_DESIGN_SYSTEM.md
04-IMPLEMENTATION/DEVELOPMENT_GUIDE.md
04-IMPLEMENTATION/API_OVERVIEW.md
06-AGENTS/AGENT-MOB/TASKS.md

# 2. Setup environment
cd /path/to/propmubi
# Follow 04-IMPLEMENTATION/DEVELOPMENT_GUIDE.md#mobile-setup

# 3. Start implementation
# Follow tasks in 06-AGENTS/AGENT-MOB/TASKS.md
```

---

### For Web App Agent (AGENT-WEB)

```bash
# 1. Read documentation in this order:
01-PRODUCT/PRD.md
02-ARCHITECTURE/SYSTEM_ARCHITECTURE.md
03-DESIGN/UI_DESIGN_SYSTEM.md
04-IMPLEMENTATION/DEVELOPMENT_GUIDE.md
06-AGENTS/AGENT-WEB/TASKS.md

# 2. Setup environment
cd /path/to/propmubi/web
npm install
npm run dev

# 3. Start implementation
# Follow tasks in 06-AGENTS/AGENT-WEB/TASKS.md
```

---

### For Backend Agent (AGENT-BE)

```bash
# 1. Read documentation in this order:
01-PRODUCT/PRD.md
02-ARCHITECTURE/SYSTEM_ARCHITECTURE.md
02-ARCHITECTURE/DATA_ARCHITECTURE.md
04-IMPLEMENTATION/DEVELOPMENT_GUIDE.md
04-IMPLEMENTATION/API_OVERVIEW.md
04-IMPLEMENTATION/SERVICE_CATALOG.md
06-AGENTS/AGENT-BE/TASKS.md

# 2. Setup environment
cd /path/to/propmubi/backend
poetry install
poetry shell

# 3. Start implementation
# Follow tasks in 06-AGENTS/AGENT-BE/TASKS.md
```

---

### For Digital Twin Agent (AGENT-DT)

```bash
# 1. Read documentation in this order:
01-PRODUCT/PRD.md (Digital Twin section)
02-ARCHITECTURE/SYSTEM_ARCHITECTURE.md
03-DESIGN/3D_VISUALIZATION.md
04-IMPLEMENTATION/DEVELOPMENT_GUIDE.md
06-AGENTS/AGENT-DT/TASKS.md

# 2. Start implementation
# Follow tasks in 06-AGENTS/AGENT-DT/TASKS.md
```

---

### For AI/ML Agent (AGENT-AI)

```bash
# 1. Read documentation in this order:
01-PRODUCT/PRD.md (AI features section)
02-ARCHITECTURE/SYSTEM_ARCHITECTURE.md (AI Orchestrator)
04-IMPLEMENTATION/SERVICE_CATALOG.md (AI Orchestrator)
06-AGENTS/AGENT-AI/TASKS.md

# 2. Start implementation
# Follow tasks in 06-AGENTS/AGENT-AI/TASKS.md
```

---

### For Infrastructure Agent (AGENT-INFRA)

```bash
# 1. Read documentation in this order:
02-ARCHITECTURE/INFRASTRUCTURE.md
04-IMPLEMENTATION/DEPLOYMENT_GUIDE.md
06-AGENTS/AGENT-INFRA/TASKS.md

# 2. Start implementation
# Follow tasks in 06-AGENTS/AGENT-INFRA/TASKS.md
```

---

## 📋 Implementation Checklist (For All Agents)

### Before Starting Any Task

- [ ] I have read the entire documentation for my role
- [ ] I understand the project architecture
- [ ] I have my development environment set up
- [ ] I know which directory is my exclusive write area
- [ ] I have the required API keys and credentials
- [ ] I understand the coding standards
- [ ] I know how to run tests

---

### During Implementation

- [ ] I am writing tests BEFORE implementation (TDD)
- [ ] I am following the exact schemas from documentation
- [ ] I am using exact API endpoints from API_OVERVIEW.md
- [ ] I am staying within my assigned directory
- [ ] I am committing frequently with good messages
- [ ] I am running tests after each change
- [ ] I am updating documentation when needed

---

### Before Completing Task

- [ ] All tests pass (minimum 85% coverage)
- [ ] Code follows coding standards
- [ ] API endpoints match documentation exactly
- [ ] Database schemas match documentation exactly
- [ ] No hardcoded values (use environment variables)
- [ ] No security vulnerabilities
- [ ] Code is documented (comments for complex logic)
- [ ] Committed and pushed to feature branch
- [ ] Pull request created with description

---

## 🏗️ Project Architecture Overview

### Monorepo Structure

```
propmubi/
├── web/                          # React web app (Vite)
│   ├── src/
│   │   ├── pages/               # Page components
│   │   ├── components/          # Reusable components
│   │   ├── styles/              # CSS modules
│   │   └── utils/               # Utilities
│   └── package.json
│
├── mobile/                       # React Native mobile app (Expo)
│   ├── src/
│   │   ├── screens/             # Screen components
│   │   ├── components/          # Reusable components
│   │   ├── navigation/          # Navigation setup
│   │   └── utils/               # Utilities
│   └── package.json
│
├── backend/                      # FastAPI microservices
│   ├── services/
│   │   ├── auth-service/        # Port 3001
│   │   ├── property-service/    # Port 3002
│   │   ├── trust-service/       # Port 3006
│   │   ├── legal-service/       # Port 3007
│   │   ├── reputation-service/  # Port 3012
│   │   ├── inspection-service/  # Port 3013
│   │   ├── marketing-service/   # Port 3014
│   │   ├── agent-service/       # Port 3015
│   │   └── crm-service/         # Port 3016
│   └── shared/
│       ├── domain/              # Domain models
│       └── common/              # Shared utilities
│
├── database/                     # Database migrations & seeds
│   ├── migrations/              # SQL migration scripts
│   └── seeds/                   # Seed data
│
├── k8s/                         # Kubernetes manifests
│   ├── base/                    # Base configurations
│   └── overlays/                # Environment-specific
│
├── terraform/                   # Infrastructure as Code
│   ├── providers/
│   │   ├── aws/
│   │   └── gcp/
│   └── environments/
│       ├── dev/
│       ├── staging/
│       └── prod/
│
└── docs/                        # Documentation (you are here)
    ├── 00-START-HERE/
    ├── 01-PRODUCT/
    ├── 02-ARCHITECTURE/
    ├── 03-DESIGN/
    ├── 04-IMPLEMENTATION/
    ├── 05-TESTING/
    ├── 06-AGENTS/
    └── 09-STANDARDS/
```

---

## 🔑 Key Technologies

### Frontend
- **Web**: React 18 + Vite + TypeScript
- **Mobile**: React Native + Expo + TypeScript
- **UI**: NativeWind (Tailwind for React Native)
- **State**: React Query + Zustand
- **Routing**: React Router (Web), React Navigation (Mobile)

### Backend
- **Framework**: FastAPI (Python 3.11)
- **API Gateway**: Kong / Traefik
- **Database**: PostgreSQL 15 + PostGIS
- **Cache**: Redis 7
- **Search**: Elasticsearch 8
- **Vector DB**: Qdrant
- **Storage**: S3 / MinIO
- **Event Bus**: Redis Streams

### AI/ML
- **LLM Router**: LiteLLM
- **LLM Providers**: GPT-4, Claude, Ollama
- **Agent Framework**: LangGraph
- **Embeddings**: OpenAI Ada-002

### Infrastructure
- **Containers**: Docker
- **Orchestration**: Kubernetes (EKS/GKE)
- **IaC**: Terraform
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: Loki + Promtail
- **Tracing**: Jaeger

---

## 🚦 Development Workflow

### 1. Get Assignment
```bash
# Read your agent tasks
cat docs/06-AGENTS/AGENT-{YOUR-NAME}/TASKS.md
```

### 2. Create Feature Branch
```bash
git checkout -b feature/AGENT-{YOUR-NAME}-{TASK-ID}-{description}
# Example: feature/AGENT-BE-001-auth-service
```

### 3. Implement with TDD
```bash
# 1. Write test (must fail)
# 2. Write minimum code to pass
# 3. Refactor
# 4. Repeat
```

### 4. Run Tests
```bash
# Backend
cd backend/services/auth-service
pytest tests/ --cov=src --cov-report=html

# Frontend
cd web
npm run test
npm run test:coverage
```

### 5. Commit & Push
```bash
git add .
git commit -m "feat(auth): implement JWT authentication

- Add JWT token generation
- Add token validation middleware
- Add refresh token rotation
- Tests: 92% coverage

Refs: AGENT-BE-001"

git push origin feature/AGENT-BE-001-auth-service
```

### 6. Create Pull Request
```bash
# Use GitHub CLI
gh pr create \
  --title "feat(auth): Implement JWT authentication" \
  --body "## Summary
Implements JWT authentication with refresh token rotation.

## Changes
- JWT token generation and validation
- Refresh token rotation
- Password hashing with bcrypt
- Rate limiting for login attempts

## Testing
- Unit tests: 45 passed
- Coverage: 92%

## Checklist
- [x] Tests written first (TDD)
- [x] Code follows standards
- [x] Documentation updated
- [x] All tests pass
- [x] No security issues

Refs: #AGENT-BE-001"
```

---

## 📚 Critical Documents (Must Read)

### For ALL Agents
1. **[04-IMPLEMENTATION/DEVELOPMENT_GUIDE.md](../04-IMPLEMENTATION/DEVELOPMENT_GUIDE.md)**
   - Setup instructions
   - Development workflows
   - Testing strategies

2. **[09-STANDARDS/CODING_STANDARDS.md](../09-STANDARDS/CODING_STANDARDS.md)**
   - Code style
   - Naming conventions
   - Best practices

### For Backend Agents
1. **[04-IMPLEMENTATION/API_OVERVIEW.md](../04-IMPLEMENTATION/API_OVERVIEW.md)**
   - Complete API documentation
   - Request/response formats
   - Error handling

2. **[04-IMPLEMENTATION/SERVICE_CATALOG.md](../04-IMPLEMENTATION/SERVICE_CATALOG.md)**
   - All microservices
   - Database schemas
   - Technology stack

### For Frontend Agents
1. **[03-DESIGN/UI_DESIGN_SYSTEM.md](../03-DESIGN/UI_DESIGN_SYSTEM.md)**
   - Design tokens
   - Component library
   - Style guidelines

---

## ⚠️ Common Pitfalls (Avoid These)

### 1. Not Reading Documentation
```
❌ DON'T: Start coding immediately
✅ DO: Read all assigned documentation first
```

### 2. Guessing API Endpoints
```
❌ DON'T: Create endpoints like POST /users/login
✅ DO: Use exact endpoint from API_OVERVIEW.md
      POST /api/v1/auth/login
```

### 3. Inventing Database Schemas
```
❌ DON'T: Create your own table structure
✅ DO: Use exact schema from SERVICE_CATALOG.md
```

### 4. Skipping Tests
```
❌ DON'T: Write code first, tests later
✅ DO: Write failing test first, then implement
```

### 5. Modifying Other Agents' Code
```
❌ DON'T: Touch code outside your directory
✅ DO: Stay in your exclusive write area
```

### 6. Hardcoding Values
```
❌ DON'T: const API_KEY = "sk-abc123..."
✅ DO: const API_KEY = process.env.API_KEY
```

### 7. Ignoring Error Handling
```
❌ DON'T: Assume everything works
✅ DO: Handle all error cases with proper status codes
```

---

## 🆘 Getting Help

### When Stuck
1. **Check Documentation First**
   - Search docs for your question
   - Check examples in other agents' completed work

2. **Ask Specific Questions**
   ```
   ❌ BAD: "How do I build authentication?"
   ✅ GOOD: "In SERVICE_CATALOG.md, the users table has
            'password_hash' field. Which hashing algorithm
            should I use? Is it specified in the docs?"
   ```

3. **Provide Context**
   - What task are you working on?
   - What documentation did you read?
   - What have you tried?
   - What specific error are you getting?

---

## ✅ Success Criteria

### Your Task is Complete When:
- [ ] All tests pass (≥85% coverage)
- [ ] Code follows standards from docs
- [ ] API endpoints match API_OVERVIEW.md exactly
- [ ] Database schemas match SERVICE_CATALOG.md exactly
- [ ] No hardcoded credentials
- [ ] Error handling implemented
- [ ] Logging added for debugging
- [ ] Documentation updated if needed
- [ ] Feature branch pushed
- [ ] Pull request created
- [ ] Code review passed
- [ ] Merged to develop

---

## 🎓 Learning Path

### Week 1: Foundation
- [ ] Read ALL documentation in 00-04 sections
- [ ] Setup development environment
- [ ] Complete first "Hello World" task
- [ ] Get familiar with testing

### Week 2: Implementation
- [ ] Complete 3-5 tasks from your agent directory
- [ ] Practice TDD workflow
- [ ] Get code reviews
- [ ] Learn from feedback

### Week 3: Independence
- [ ] Complete tasks without guidance
- [ ] Help other agents with questions
- [ ] Suggest documentation improvements
- [ ] Optimize your code

---

## 📞 Project Contacts

### Agent Roles
- **AGENT-MOB**: Mobile app (React Native + Expo)
- **AGENT-WEB**: Web app (React + Vite)
- **AGENT-BE**: Backend services (FastAPI microservices)
- **AGENT-DT**: Digital Twin (Three.js + Unity)
- **AGENT-AI**: AI/ML (LangGraph + LLMs)
- **AGENT-INFRA**: Infrastructure (Terraform + K8s)

### Communication Channels
- **Documentation Updates**: Create PR in docs/
- **Technical Questions**: Check docs first, then ask
- **Blockers**: Document in your TASKS.md, then escalate

---

## 🚀 Ready to Start?

### Next Steps:
1. **Read your agent-specific tasks**
   ```bash
   cd docs/06-AGENTS/AGENT-{YOUR-NAME}/
   cat TASKS.md
   ```

2. **Read critical implementation docs**
   - 04-IMPLEMENTATION/DEVELOPMENT_GUIDE.md
   - 04-IMPLEMENTATION/API_OVERVIEW.md (backend agents)
   - 04-IMPLEMENTATION/SERVICE_CATALOG.md (backend agents)

3. **Setup your environment**
   - Follow DEVELOPMENT_GUIDE.md step-by-step
   - Install all prerequisites
   - Verify everything works

4. **Start first task**
   - Create feature branch
   - Write failing test
   - Implement feature
   - Make test pass
   - Commit & push

---

## 🎯 Remember

> **"If it's not in the documentation, don't guess it."**
>
> **"Tests first, code second, always."**
>
> **"Your directory, your responsibility."**

---

**Last Updated**: January 8, 2026
**Status**: ✅ Production Ready
**Version**: 2.0 (Golden Agentic Structure)

**Now go to**: `06-AGENTS/AGENT-{YOUR-NAME}/TASKS.md`
