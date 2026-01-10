# 🧪 TEST STRATEGY - PropMubi Trust OS

## 1. Quality Philosophy
Our testing ensures **Canonical Truth**. 
- If a score is calculated, there must be a traceable data path.
- If a lead is captured, there must be an explicit consent audit.

## 2. Testing Levels

### Unit Testing (Backend)
- **Trust Engine Logic**: `pytest` for all scoring variants.
- **RERA Scrapers**: Verify extraction against mock HTML.
- **Deduplication**: Verify phone/email hashing logic.

### Integration Testing
- **Consent Flow**: Mobile App -> Auth -> User Consent Record.
- **Lead Flow**: Mobile App -> Lead API -> CRM Record.
- **Marketing Polling**: Web Dashboard -> API -> Real-time count update.

### E2E Verification
- **User Journey**: OTP Login -> Property Discovery -> Digital Twin View -> Loan Check -> Book Visit.
- **Admin Journey**: Lead Intake -> Agent Assignment -> Commission Locking.

## 3. Automation
- GitHub Actions for CI.
- 85% mandatory code coverage.
- Daily regression of Trust Scores.
