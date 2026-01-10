# 🔀 Git Workflow - PropMubi

**Mandatory Git workflow for all agents**

---

## 🌳 Branch Strategy

### Branch Types

```
main (production)
  ↓
develop (integration)
  ↓
feature/AGENT-{NAME}-{TASK-ID}-{description}
hotfix/{issue-number}-{description}
release/v{version}
```

---

## 🚀 Workflow

### 1. Start New Task

```bash
# Always start from develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/AGENT-BE-001-auth-service
```

### 2. Commit Format

```bash
git commit -m "type(scope): subject

- Bullet point 1
- Bullet point 2

Refs: AGENT-BE-001"
```

**Types**: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`

### 3. Push & PR

```bash
git push origin feature/AGENT-BE-001-auth-service

gh pr create \
  --title "feat(auth): Implement JWT authentication" \
  --body "## Summary
Implements JWT authentication

## Changes
- JWT generation
- Token validation

## Testing
- Coverage: 92%

Refs: #AGENT-BE-001"
```

---

## ✅ Commit Standards

### Good Commits

```bash
feat(auth): add JWT token generation
fix(property): correct price calculation bug
docs(api): update endpoint documentation
test(user): add integration tests
refactor(db): optimize query performance
```

### Bad Commits

```bash
✗ "update"
✗ "fix bug"
✗ "changes"
✗ "WIP"
```

---

**Last Updated**: January 8, 2026
