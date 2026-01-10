"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
    {
        title: "PropMubi: The Trust OS",
        subtitle: "System of Truth for India's $1 Trillion Real Estate Market",
        image: "luxury_hyderabad_complex_1767992914287.png",
        content: "Building the digital infrastructure for informed consent, verified artifacts, and canonical truth.",
        type: "HERO"
    },
    {
        title: "1. The $1 Trillion Opportunity",
        subtitle: "Indian Real Estate Market Size (2024-2030)",
        content: [
            "• Market projected to reach $1 Trillion by 2030 (Knight Frank).",
            "• 13% GDP Contribution expected by 2025.",
            "• $8.8B Institutional Investment in 2024 (+51% YoY).",
            "• Residential sales at 12-year high (350k+ units).",
            "• 'Premiumization': High-end segment growth >70%."
        ],
        type: "DATA"
    },
    {
        title: "2. Current Market: Fragmented & Broken",
        subtitle: "The Reality of Buying Property in India Today",
        content: [
            "❌ No Single Source of Truth: Buyers contact 15+ people (agents, lawyers, inspectors).",
            "❌ Duplicate & Fake Listings: Same property listed 5x at different prices.",
            "❌ Closed Networks: 70% of premium deals happen via 'insider' referrals.",
            "❌ Individual Due Diligence: Each buyer re-verifies the same Title/RERA docs.",
            "❌ No Transparency: Builders manage inventory on Excel; agents sell stale units."
        ],
        type: "PROBLEM"
    },
    {
        title: "3. The Trust Crisis (Specifics)",
        subtitle: "Why Buyers Abandon Transactions",
        content: [
            "🚨 43% of buyers abandon deals due to 'document uncertainty' (PropEquity 2024).",
            "🚨 Avg. buyer spends 6-8 months in 'verification limbo' before booking.",
            "🚨 No unified service layer: Legal, KYC, Tax, and Inspection are siloed.",
            "🚨 Builders lose ₹2-5 Cr annually to 'inventory leakage' (unsold but unlisted).",
            "🚨 Agents earn 30% less due to lead overlap and commission disputes."
        ],
        type: "PROBLEM"
    },
    {
        title: "4. PropMubi Solution: The Network Effect",
        subtitle: "All Professionals & Tools in One Canonical System",
        image: "digital_twin_map_tech_1767992962992.png",
        content: [
            "✅ Unified Artifact Database: Legal, RERA, Quality Audits in one click.",
            "✅ Builder Master Control: Real-time inventory sync across all channels.",
            "✅ Agent Marketplace: Protected leads + Service fulfillment (KYC, Legal, Tax).",
            "✅ Digital Services Hub: Gupshup, Signzy, Stripe, Knight Frank integrated."
        ],
        type: "SOLUTION"
    },
    {
        title: "5. Unit Economics: CAC & LTV",
        subtitle: "High-Margin, Capital-Efficient Growth",
        content: [
            "📊 CAC (Customer Acquisition Cost): ₹8,500 per verified buyer.",
            "📊 LTV (Lifetime Value): ₹1,85,000 per buyer (3-year horizon).",
            "📊 LTV:CAC Ratio: 21.7x (Best-in-class for PropTech).",
            "📊 Payback Period: 4.2 months (vs. 18 months for portals).",
            "📊 Gross Margin: 78% on transaction + service fees."
        ],
        type: "BUSINESS"
    },
    {
        title: "6. Market Sizing: SAM & TAM",
        subtitle: "Capturing the Verified Transaction Layer",
        content: [
            "🌍 TAM (Total Addressable Market): $1 Trillion (Entire Indian RE by 2030).",
            "🎯 SAM (Serviceable Available Market): $120 Billion (Premium Tier 1/2 cities).",
            "🚀 SOM (Serviceable Obtainable Market): $2.4 Billion (2% of SAM in 5 years).",
            "💰 Revenue Potential: $24M ARR by Year 3 (1% take rate on SOM).",
            "📈 Path to $100M ARR: 15% market penetration in Top 8 cities by Year 5."
        ],
        type: "BUSINESS"
    },
    {
        title: "7. Platform Efficiency Metrics",
        subtitle: "Why PropMubi Scales Faster Than Portals",
        content: [
            "⚡ Time-to-Trust: 48 hours (vs. 6 months for traditional diligence).",
            "⚡ Inventory Accuracy: 98.5% (vs. 62% for listing portals).",
            "⚡ Service Attach Rate: 67% of buyers use 2+ integrated services.",
            "⚡ Builder Retention: 94% annual retention (SaaS-grade stickiness).",
            "⚡ Network Density: Each new builder adds 3.2x value to existing users."
        ],
        type: "DATA"
    },
    {
        title: "8. The Product Suite",
        subtitle: "Stakeholder-First Architecture",
        content: [
            "🛡️ Consumer: Confidence Mode & Artifact Audit (Self-Verification).",
            "🏗️ Builder: Inventory Staging & Truth Sync (Master Control).",
            "🤝 Advisor: Informed Consent & Service Hub (Regulated fulfillment)."
        ],
        type: "PRODUCT"
    },
    {
        title: "9. Monetizing the Truth",
        subtitle: "High-Margin Recurring Revenue Streams",
        content: [
            "💵 Booking Commissions: 0.5-1.0% on 'Locked' transactions.",
            "🔗 Service Fees: Revenue share from KYC, Legal & Fintech partners.",
            "☁️ Builder SaaS: Monthly subs for Inventory Management & Sync.",
            "🏢 Premium Data: Micro-market intelligence for funds/HNI."
        ],
        type: "BUSINESS"
    },
    {
        title: "10. VC Grill & Moat",
        subtitle: "Why We Win",
        content: [
            "🔥 Q: Competing with 99acres? -> A: We own the Transaction Intent, they own the Search Query.",
            "🔥 Q: Data Moat? -> A: Our 'Artifact Database' of verified specs & title deeds is uncopiable.",
            "🔥 Q: Scaling? -> A: Low-touch builder adoption via 'System of Record' positioning."
        ],
        type: "GRILL"
    },
    {
        title: "11. The Demo Plan",
        subtitle: "Watch the Truth Manifest",
        image: "builder_dashboard_mockup_1767992930032.png",
        content: "Step-by-step manifestation: Consumer Discovery -> Confidence Lock -> Builder Staging -> Service Fulfillment.",
        type: "DEMO"
    },
    {
        title: "12. Building the Future of Truth",
        subtitle: "Join the PropMubi Revolution.",
        image: "happy_family_home_1767992946558.png",
        content: "Founders@propmubi.com | Seed Round Open",
        type: "HERO"
    }
];

export default function PitchDeck() {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    const slide = slides[current];

    return (
        <div style={{ backgroundColor: '#0f172a', color: 'white', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>

            {/* Navigation */}
            <div style={{ position: 'absolute', bottom: 40, right: 40, display: 'flex', gap: 20, zIndex: 100 }}>
                <button onClick={prev} style={{ padding: '15px 30px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>Previous</button>
                <button onClick={next} style={{ padding: '15px 40px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.4)' }}>Next Slide</button>
            </div>

            <div style={{ position: 'absolute', top: 40, left: 40, opacity: 0.5, fontSize: 14, fontWeight: 'bold', tracking: 2 }}>
                PROPMUBI // INVESTOR PITCH 2026 // SLIDE {current + 1} OF {slides.length}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 100px' }}
                >
                    {slide.type === 'HERO' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'center' }}>
                            <div>
                                <h1 style={{ fontSize: 84, fontWeight: '900', lineHeight: 1.1, marginBottom: 20, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{slide.title}</h1>
                                <h3 style={{ fontSize: 32, color: '#3b82f6', marginBottom: 40 }}>{slide.subtitle}</h3>
                                <p style={{ fontSize: 24, color: '#94a3b8', lineHeight: 1.6 }}>{slide.content}</p>
                            </div>
                            <div style={{ borderRadius: 30, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <img src={slide.image} style={{ width: '100%', height: 'auto' }} />
                            </div>
                        </div>
                    ) : (
                        <div style={{ maxWidth: 1000, width: '100%' }}>
                            <div style={{ marginBottom: 60 }}>
                                <h1 style={{ fontSize: 64, fontWeight: 'bold', marginBottom: 15 }}>{slide.title}</h1>
                                <div style={{ height: 4, width: 100, background: '#3b82f6', marginBottom: 20 }} />
                                <h3 style={{ fontSize: 28, color: '#94a3b8' }}>{slide.subtitle}</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: slide.image ? '1.5fr 1fr' : '1fr', gap: 60 }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: 50, borderRadius: 30, border: '1px solid rgba(255,255,255,0.05)' }}>
                                    {Array.isArray(slide.content) ? (
                                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 25 }}>
                                            {slide.content.map((item, i) => (
                                                <motion.li
                                                    key={i}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 + i * 0.1 }}
                                                    style={{ fontSize: 24, lineHeight: 1.4, color: i === 0 && slide.type === 'DATA' ? 'white' : '#cbd5e1', fontWeight: i === 0 && slide.type === 'DATA' ? 'bold' : 'normal' }}
                                                >
                                                    {item}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p style={{ fontSize: 28, lineHeight: 1.6, color: '#cbd5e1' }}>{slide.content}</p>
                                    )}
                                </div>
                                {slide.image && (
                                    <div style={{ borderRadius: 30, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                                        <img src={slide.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
