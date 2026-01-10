# AGENT-QA TASKS

## 📋 Task Priority

### QA-001: Trust Engine Verification (Automated) ⏳
**Context**: Ensure Financial and Reputation logic doesn't regress.
- [ ] Create `pytest` suite for edge cases (e.g., negative income, 0 assets).
- [ ] Verify "Promoter" vs "Salaried" logic paths.

### QA-002: Mobile API Integration Test ⏳
**Context**: Verify Mobile App correctly communicates with Local API.
- [ ] Test Login Flow (OTP -> Token).
- [ ] Test Feed Load (Auth Token -> Data).
- [ ] Test "Book Visit" (Auth -> POST /leads -> DB Update).

### QA-003: Dashboard Data Accuracy ⏳
**Context**: Ensure Builder Dashboard reflects real-time changes.
- [ ] Verify Polling mechanism works (2s interval).
- [ ] Verify Chart.js renders correctly with 0 data and high data.

## 🛠️ Tools
- **Backend**: `pytest`, `httpx`
- **Frontend**: Manual Verification (via Browser Agent)
