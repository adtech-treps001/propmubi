# 📏 Coding Standards - PropMubi

**Mandatory coding standards for all agents to ensure consistency and quality**

---

## 🎯 Core Principles

1. **Readability First** - Code is read 10x more than written
2. **Consistency Always** - Follow established patterns
3. **Test Everything** - No code without tests
4. **Document Intent** - Comments explain WHY, not WHAT
5. **Security By Default** - Never trust user input

---

## 📋 General Standards

### File Naming

```
✅ CORRECT:
auth-service.ts
user-repository.py
PropertyCard.tsx
utils.test.ts
database-schema.sql

❌ INCORRECT:
Auth_Service.ts
UserRepository.py
propertycard.tsx
utilsTest.ts
DatabaseSchema.SQL
```

**Rules**:
- **TypeScript/JavaScript**: `kebab-case.ts` for files, `PascalCase.tsx` for React components
- **Python**: `snake_case.py` for all files
- **SQL**: `kebab-case.sql`
- **Test files**: `*.test.ts` or `test_*.py`

---

### Directory Structure

```
✅ CORRECT:
services/auth-service/
  src/
    routes/
    controllers/
    services/
    models/
    utils/
  tests/
    unit/
    integration/
  config/
  migrations/

❌ INCORRECT:
services/AuthService/
  source/
  Routes/
  TESTS/
```

**Rules**:
- All lowercase with hyphens
- Clear separation: `src/`, `tests/`, `config/`
- Group by feature, not by type

---

## 🎨 TypeScript/JavaScript Standards

### Naming Conventions

```typescript
// ✅ CORRECT

// Interfaces: PascalCase with 'I' prefix (optional)
interface User {
  id: string;
  email: string;
}

// Types: PascalCase
type UserRole = 'buyer' | 'seller' | 'agent' | 'builder';

// Classes: PascalCase
class UserService {
  constructor() {}
}

// Functions/Methods: camelCase
function calculateEMI(principal: number, rate: number): number {
  return principal * rate;
}

// Constants: UPPER_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 5;
const API_BASE_URL = process.env.API_URL;

// Variables: camelCase
let userCount = 0;
const propertyList = [];

// Private properties: prefix with '_'
class Service {
  private _cache: Map<string, any>;
}

// Boolean variables: is/has/should prefix
const isAuthenticated = true;
const hasPermission = false;
const shouldRedirect = true;
```

```typescript
// ❌ INCORRECT
interface user {}              // Should be PascalCase
type userRole = string;        // Should be PascalCase
function CalculateEMI() {}     // Should be camelCase
const max_attempts = 5;        // Should be UPPER_SNAKE_CASE
let UserCount = 0;             // Should be camelCase
const authenticated = true;    // Should be isAuthenticated
```

---

### Type Annotations

```typescript
// ✅ ALWAYS use explicit types

// Function parameters and return types
function getUser(id: string): Promise<User> {
  return fetchUser(id);
}

// Variable declarations
const userName: string = "John Doe";
const userAge: number = 30;
const isActive: boolean = true;

// Array types
const users: User[] = [];
const ids: string[] = ['1', '2', '3'];

// Object types
const config: {
  apiUrl: string;
  timeout: number;
} = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// Generic types
function createArray<T>(items: T[]): T[] {
  return items;
}
```

```typescript
// ❌ AVOID implicit any

function getUser(id) {          // Missing types
  return fetchUser(id);
}

const userName = "John";        // Implicit string (acceptable but not preferred)
const users = [];               // Implicit any[]
```

---

### Async/Await

```typescript
// ✅ CORRECT - Use async/await

async function fetchUserData(userId: string): Promise<User> {
  try {
    const user = await userRepository.findById(userId);
    const profile = await profileRepository.findByUserId(userId);

    return {
      ...user,
      profile
    };
  } catch (error) {
    logger.error('Failed to fetch user data', { userId, error });
    throw new UserNotFoundError(userId);
  }
}

// Multiple parallel requests
async function fetchDashboardData(): Promise<DashboardData> {
  const [users, properties, stats] = await Promise.all([
    fetchUsers(),
    fetchProperties(),
    fetchStats()
  ]);

  return { users, properties, stats };
}
```

```typescript
// ❌ INCORRECT - Don't use callbacks or raw promises

function fetchUserData(userId: string) {
  return userRepository.findById(userId)
    .then(user => {
      return profileRepository.findByUserId(userId)
        .then(profile => {
          return { ...user, profile };
        });
    })
    .catch(error => {
      console.error(error);
    });
}
```

---

### Error Handling

```typescript
// ✅ CORRECT - Custom error classes

class UserNotFoundError extends Error {
  constructor(
    public userId: string,
    message: string = 'User not found'
  ) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

class ValidationError extends Error {
  constructor(
    public field: string,
    message: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Proper error handling
async function getUser(userId: string): Promise<User> {
  try {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    return user;
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      logger.warn('User not found', { userId });
      throw error;
    }

    logger.error('Unexpected error fetching user', {
      userId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    throw new Error('Failed to fetch user');
  }
}
```

```typescript
// ❌ INCORRECT

async function getUser(userId: string) {
  try {
    return await userRepository.findById(userId);
  } catch (e) {
    console.log(e);              // Don't use console.log
    return null;                 // Don't swallow errors
  }
}
```

---

### React Components

```typescript
// ✅ CORRECT - Functional components with TypeScript

import React, { useState, useEffect } from 'react';

interface PropertyCardProps {
  property: Property;
  onSelect?: (id: string) => void;
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  className = ''
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Load favorite status
    loadFavoriteStatus(property.id).then(setIsFavorite);
  }, [property.id]);

  const handleClick = () => {
    onSelect?.(property.id);
  };

  return (
    <div className={`property-card ${className}`} onClick={handleClick}>
      <h3>{property.name}</h3>
      <p>{formatPrice(property.price)}</p>
    </div>
  );
};
```

```typescript
// ❌ INCORRECT

// Missing types
export const PropertyCard = ({ property, onSelect }) => {
  const [isFavorite, setIsFavorite] = useState();  // Missing type

  // Missing dependencies in useEffect
  useEffect(() => {
    loadFavoriteStatus(property.id).then(setIsFavorite);
  }, []);

  return <div>...</div>;
};
```

---

## 🐍 Python Standards

### Naming Conventions

```python
# ✅ CORRECT

# Classes: PascalCase
class UserService:
    pass

# Functions/methods: snake_case
def calculate_emi(principal: float, rate: float) -> float:
    return principal * rate

# Constants: UPPER_SNAKE_CASE
MAX_LOGIN_ATTEMPTS = 5
API_BASE_URL = os.getenv("API_URL")

# Variables: snake_case
user_count = 0
property_list = []

# Private methods: prefix with '_'
class Service:
    def _validate_input(self):
        pass

# Boolean variables: is/has/should prefix
is_authenticated = True
has_permission = False
should_redirect = True
```

```python
# ❌ INCORRECT
class userService:           # Should be PascalCase
def CalculateEMI():         # Should be snake_case
MAX_ATTEMPTS = 5            # OK but prefer UPPER_SNAKE_CASE
UserCount = 0               # Should be snake_case
authenticated = True        # Should be is_authenticated
```

---

### Type Hints

```python
# ✅ ALWAYS use type hints

from typing import Optional, List, Dict
from decimal import Decimal

# Function annotations
def get_user(user_id: str) -> Optional[User]:
    return user_repository.find_by_id(user_id)

def calculate_emi(
    principal: Decimal,
    interest_rate: float,
    tenure_months: int
) -> Decimal:
    rate = Decimal(interest_rate) / Decimal(1200)
    return principal * rate

# Class attributes
class UserService:
    def __init__(self) -> None:
        self.cache: Dict[str, User] = {}
        self.users: List[User] = []

    async def find_by_email(self, email: str) -> Optional[User]:
        return await self.repository.find_one({"email": email})
```

```python
# ❌ AVOID missing type hints

def get_user(user_id):      # Missing types
    return user_repository.find_by_id(user_id)
```

---

### FastAPI Standards

```python
# ✅ CORRECT - FastAPI route with proper validation

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field, validator

router = APIRouter(prefix="/api/v1/users", tags=["users"])

class UserCreate(BaseModel):
    email: str = Field(..., regex=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., regex=r'^\+?[1-9]\d{1,14}$')

    @validator('password')
    def validate_password(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain digit')
        return v

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    created_at: datetime

    class Config:
        from_attributes = True

@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new user",
    description="Register a new user with email and password"
)
async def create_user(
    user_data: UserCreate,
    service: UserService = Depends(get_user_service)
) -> UserResponse:
    """
    Create a new user account.

    Args:
        user_data: User registration data
        service: Injected user service

    Returns:
        Created user object

    Raises:
        HTTPException: 400 if email already exists
    """
    try:
        user = await service.create_user(user_data)
        return UserResponse.from_orm(user)
    except EmailAlreadyExistsError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email already registered: {e.email}"
        )
    except Exception as e:
        logger.error("Failed to create user", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
```

---

### SQLAlchemy Models

```python
# ✅ CORRECT

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    properties = relationship("Property", back_populates="owner")

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email})>"
```

---

## 🗄️ SQL Standards

### Table Naming

```sql
-- ✅ CORRECT - Plural, lowercase, underscores
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE property_listings (
    id UUID PRIMARY KEY,
    property_id UUID REFERENCES properties(id)
);

-- ❌ INCORRECT
CREATE TABLE User (           -- Should be lowercase plural
    ID uuid,                  -- Should be lowercase
    Email varchar(255)        -- Should be lowercase
);

CREATE TABLE PropertyListing ( -- Should be snake_case
    id uuid
);
```

---

### Column Naming

```sql
-- ✅ CORRECT
CREATE TABLE users (
    id UUID,
    email VARCHAR(255),
    full_name VARCHAR(255),
    is_active BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Foreign keys: {table_singular}_id
CREATE TABLE properties (
    id UUID,
    user_id UUID REFERENCES users(id),
    builder_id UUID REFERENCES users(id)
);

-- ❌ INCORRECT
CREATE TABLE users (
    ID uuid,                  -- Should be lowercase
    Email varchar(255),       -- Should be lowercase
    FullName varchar(255),    -- Should be snake_case
    Active boolean,           -- Should be is_active
    CreatedAt timestamp       -- Should be snake_case
);
```

---

### Indexes

```sql
-- ✅ CORRECT - Descriptive index names
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_location ON properties USING GIST(location);

-- Composite indexes
CREATE INDEX idx_properties_city_status ON properties(city, status);

-- ❌ INCORRECT
CREATE INDEX users_email ON users(email);      -- Missing 'idx_' prefix
CREATE INDEX idx1 ON properties(user_id);      -- Not descriptive
```

---

## 🧪 Testing Standards

### Test File Naming

```
✅ CORRECT:
src/services/auth-service.ts
tests/unit/auth-service.test.ts

src/utils/validators.py
tests/unit/test_validators.py

❌ INCORRECT:
tests/auth-service-test.ts
tests/validatorsTest.py
```

---

### Test Structure

```typescript
// ✅ CORRECT - TypeScript/JavaScript

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UserService } from '../services/user-service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  afterEach(() => {
    // Cleanup
  });

  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        full_name: 'Test User'
      };

      // Act
      const user = await service.createUser(userData);

      // Assert
      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.password_hash).not.toBe(userData.password);
    });

    it('should throw error when email already exists', async () => {
      // Arrange
      const userData = { email: 'existing@example.com', ... };
      await service.createUser(userData);

      // Act & Assert
      await expect(service.createUser(userData))
        .rejects
        .toThrow(EmailAlreadyExistsError);
    });
  });
});
```

```python
# ✅ CORRECT - Python

import pytest
from src.services.user_service import UserService
from src.exceptions import EmailAlreadyExistsError

class TestUserService:
    @pytest.fixture
    def service(self):
        return UserService()

    def test_create_user_with_valid_data(self, service):
        # Arrange
        user_data = {
            "email": "test@example.com",
            "password": "SecurePass123!",
            "full_name": "Test User"
        }

        # Act
        user = await service.create_user(user_data)

        # Assert
        assert user.id is not None
        assert user.email == user_data["email"]
        assert user.password_hash != user_data["password"]

    def test_create_user_raises_error_when_email_exists(self, service):
        # Arrange
        user_data = {"email": "existing@example.com", ...}
        await service.create_user(user_data)

        # Act & Assert
        with pytest.raises(EmailAlreadyExistsError):
            await service.create_user(user_data)
```

---

## 📝 Comments & Documentation

### When to Comment

```typescript
// ✅ GOOD - Explain WHY, not WHAT

// Use binary search because dataset can be very large (10M+ records)
const index = binarySearch(sortedArray, target);

// Retry 3 times because external API is unreliable
const MAX_RETRIES = 3;

// Cache for 5 minutes to reduce database load
const CACHE_TTL = 300;

/**
 * Calculate EMI using reducing balance method.
 *
 * Formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
 * where P = principal, R = monthly rate, N = tenure in months
 *
 * @param principal - Loan amount in INR
 * @param annualRate - Annual interest rate (e.g., 8.5 for 8.5%)
 * @param tenureMonths - Loan tenure in months
 * @returns Monthly EMI amount
 */
function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  const monthlyRate = annualRate / 1200;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
}
```

```typescript
// ❌ BAD - Obvious comments

// Get user by ID
const user = await getUser(id);

// Set user count to 0
let userCount = 0;

// Loop through users
for (const user of users) {
  // Process user
  processUser(user);
}
```

---

## 🔒 Security Standards

### Never Hardcode Secrets

```typescript
// ✅ CORRECT
const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;
const RAZORPAY_KEY = process.env.RAZORPAY_KEY_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// ❌ INCORRECT
const JWT_SECRET = "my-secret-key-12345";
const DATABASE_URL = "postgresql://user:pass@localhost/db";
```

---

### Input Validation

```typescript
// ✅ CORRECT - Validate all inputs

import { z } from 'zod';

const UserCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[A-Z])(?=.*\d)/),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/)
});

async function createUser(data: unknown) {
  // Validate before use
  const validated = UserCreateSchema.parse(data);
  return await userService.create(validated);
}

// ❌ INCORRECT - Using unvalidated input
async function createUser(data: any) {
  return await userService.create(data);  // Dangerous!
}
```

---

### SQL Injection Prevention

```python
# ✅ CORRECT - Use parameterized queries

async def get_user(email: str) -> Optional[User]:
    query = "SELECT * FROM users WHERE email = $1"
    return await db.fetch_one(query, email)

# ❌ INCORRECT - String concatenation
async def get_user(email: str):
    query = f"SELECT * FROM users WHERE email = '{email}'"  # SQL Injection!
    return await db.fetch_one(query)
```

---

## 🎨 Code Formatting

### Line Length

```
Maximum 100 characters per line
Break long lines at logical points
```

```typescript
// ✅ CORRECT
const result = await propertyService.searchProperties({
  city: 'Bangalore',
  bhk: '3BHK',
  minPrice: 5000000,
  maxPrice: 15000000
});

// ❌ INCORRECT - Too long
const result = await propertyService.searchProperties({ city: 'Bangalore', bhk: '3BHK', minPrice: 5000000, maxPrice: 15000000 });
```

---

### Indentation

```
Use 2 spaces for TypeScript/JavaScript
Use 4 spaces for Python
Never mix tabs and spaces
```

---

## ✅ Code Review Checklist

Before submitting code for review:

- [ ] All tests pass (≥85% coverage)
- [ ] No hardcoded values
- [ ] All functions have type annotations
- [ ] Error handling implemented
- [ ] Input validation added
- [ ] Logging added for debugging
- [ ] No console.log or print statements
- [ ] Comments explain WHY, not WHAT
- [ ] Code follows naming conventions
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed
- [ ] Documentation updated

---

**Last Updated**: January 8, 2026
**Status**: ✅ Mandatory for All Agents
**Enforcement**: Automated via ESLint, Prettier, Black, MyPy
