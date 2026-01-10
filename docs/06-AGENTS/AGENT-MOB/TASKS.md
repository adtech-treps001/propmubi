# AGENT-MOB TASKS

## CURRENT: Feed & Interactive Map (Week 1-2)

### MOB-001: Infinite Property Feed ⏳
**File**: `apps/mobile/app/(tabs)/feed.tsx`

```typescript
// Performance Critical: Use FlashList
<FlashList
  data={properties}
  renderItem={renderVideoCard}
  estimatedItemSize={400}
  viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
/>
```
- [ ] Implement virtualization for smooth scrolling 100+ items.
- [ ] Auto-play video when in focus, pause when out.
- [ ] Pre-fetch next 3 videos.

### MOB-002: Immersive Map View ⏳
**File**: `apps/mobile/components/TwinMap.tsx`
- [ ] Overlay Project Polygons on Mapbox/Google Maps.
- [ ] "Fly To" animation when clicking a Feed item.
- [ ] Satellite vs Street View toggle.

---

## NEXT: Fintech & Auth (Week 3)

### MOB-003: Loan Eligibility Form
**File**: `apps/mobile/app/loans/eligibility.tsx`
- [x] Multi-step wizard (Income -> EMI -> Result).
- [ ] Real-time validation using `zod`.

---

## FUTURE: Persona & Viral Sharing (Week 4)

### MOB-004: Persona-Based Comparison
- [ ] Implement "Persona Toggle" (Family vs Investor).
- [ ] Highlight differnet metrics based on selected persona.

### MOB-005: Truth-Card Viral Sharing
- [ ] Generate "Truth Snapshots" (Image + Key Facts).
- [ ] Integration: Share to WhatsApp with a trackable deep-link.
