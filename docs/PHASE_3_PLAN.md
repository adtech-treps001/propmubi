# 🚀 PHASE 3 KICKOFF - MARKETING AUTOMATION

**Status**: Ready to Start  
**Goal**: Build the "Amplification Engine" utilizing Truth Data.

---

## 🎯 OBJECTIVES

1. **Automated Content Generation (Reels)**
   - **Input**: Verified Listings (from Phase 2) + Digital Twin Data/Images.
   - **Output**: 15s Vertical Video (Mocked/Ffmpeg).
   - **Mechanism**: Template-based generation logic.

2. **WhatsApp Campaign Manager**
   - **Input**: Target Audience (Persona) + Generated Content.
   - **Consent Check**: Strict adherence to `user_consents` table.
   - **Delivery**: Mock WhatsApp Business API Integration.

3. **Social Sentiment Sensor**
   - **Input**: Google Maps Reviews for Builder Projects.
   - **Logic**: Calculate "Social Trust Score" to update Builder Reputation.

---

## 📋 PRE-REQUISITE CHECKLIST (From Phase 2)

- [x] **Verified Supply**: Available via `/agent/listings?status=VERIFIED`
- [x] **Agent Network**: 500+ Simulated Agents ready to share content.
- [x] **Consent System**: `user_consents` table populated and enforced.
- [x] **Builder Reputation**: Base score ready for social sentiment modifier.

---

## 📅 TASKS BREAKDOWN

### Backend (BE)
- **BE-008**: Marketing Service Implementation (Port 3014).
- **BE-009**: Social Ingestion Worker (Google Maps Scraper Mock).
- **BE-010**: Content Template Engine (Jinja2/Python).

### Frontend (FE)
- **FE-003**: Campaign Dashboard (Create, Schedule, Track).
- **FE-004**: Content Approval Queue (Review generated Reels).

### Mobile (MOB)
- **MOB-005**: "Share to WhatsApp" deep integration for Agents.
- **MOB-006**: "Truth Card" shareable image generator.

---

## 🧪 TEST STRATEGY

1. **Content Verification**: Ensure generated reels contain accurate Price/Location data.
2. **Consent Auditing**: Verify NO messages sent to users without `marketing_consent=TRUE`.
3. **Sentiment Logic**: Verify 1-star reviews degrade Builder Reputation Score.

---

**Signed**: Agentic Orchestrator  
**Date**: 2026-01-09  
**Next Step**: Initialize `marketing-service` scaffolding.
