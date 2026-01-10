# AGENT-FE TASKS (Web Admin & Dashboards)

## CURRENT: Builder Portal & Agent CRM (Week 1-2)

### FE-001: Builder Analytics Dashboard ⏳
**File**: `apps/web/app/page.tsx`
- [x] Implement "My Trust Score" view.
- [x] Real-time lead counter with polling.
- [ ] Connect to `reputation-service` for historic delivery data.

### FE-002: Agent CRM Dashboard ⏳
**File**: `apps/web/app/agent/page.tsx`
- [x] Basic Lead Queue UI.
- [ ] Implement "Consent Status" visual indicator.
- [ ] Commission calculator (Frontend preview).

---

## NEXT: Marketing Automation UI (Week 3)

### FE-003: Content Approval Workflow
- [ ] UI for reviewing auto-generated Reels/Posts.
- [ ] "Truth Link" verification toggle.

### FE-004: Inventory Governance
- [ ] Bulk price update tool (with immutable versioning warning).

### FE-005: Magic Onboarding UI
- [ ] Implement "Drag & Drop" zone for brochures/RERA cards.
- [ ] Loading state "Analysing Document...".
- [ ] Auto-fill form fields from API response.

---

## PRIORITY: Legal Certificate Management UI (Week 2-3)

### FE-006: Certificate Dashboard (Builder Portal) 🆕
**File**: `apps/web/app/builder/certificates/page.tsx`
**Schema Ref**: [COMPLETE_DATABASE_SCHEMAS.md](../../02-ARCHITECTURE/COMPLETE_DATABASE_SCHEMAS.md#15-legal-certificates--authorized-documents-india)
- [ ] List all certificates for builder's projects
- [ ] Filter by: `certificate_type`, `status`, `verification_status`, `expiry_date`
- [ ] Visual indicators: ✅ Verified, ⏳ Pending, ⚠️ Expiring Soon, ❌ Expired
- [ ] Upload certificate flow with drag-drop
- [ ] Real-time verification status updates

### FE-007: Certificate Timeline Visualization 🆕
**File**: `apps/web/app/buyer/project/[id]/certificates/timeline.tsx`
- [ ] Gantt chart showing approval sequence
- [ ] Critical path highlighting (blocking certificates in red)
- [ ] Delayed milestones with impact assessment
- [ ] Interactive tooltips with certificate details
- [ ] "What's Missing?" panel showing critical gaps

### FE-008: Transaction Legal Pack Viewer (Buyer Portal) 🆕
**File**: `apps/web/app/buyer/transaction/[lead_id]/legal-pack.tsx`
**API Ref**: [API_OVERVIEW.md](../../04-IMPLEMENTATION/API_OVERVIEW.md#10-legal-certificate-service-port-3011)
- [ ] Display completion percentage (0-100%)
- [ ] Document checklist with status badges
- [ ] Risk flags accordion (color-coded: 🟢 Low, 🟡 Medium, 🔴 High)
- [ ] Download full pack as PDF
- [ ] Share pack with bank/lawyer modal
- [ ] Multi-stakeholder review comments section

### FE-009: Missing Certificate Alerts 🆕
**File**: `apps/web/components/alerts/MissingCertificateAlert.tsx`
- [ ] Severity-based color coding (CRITICAL = red, HIGH = orange)
- [ ] "Why This Matters" expandable explanation
- [ ] Expected resolution timeline
- [ ] Auto-dismiss when resolved
- [ ] Link to authority follow-up tracker

### FE-010: Authority Follow-Up Tracker (Legal Team) 🆕
**File**: `apps/web/app/legal/follow-ups/page.tsx`
- [ ] Kanban board: Pending → In Progress → Completed
- [ ] Next follow-up date calendar integration
- [ ] Auto-reminder notifications (7 days before)
- [ ] Communication log timeline
- [ ] Quick action: "Log Communication" modal

