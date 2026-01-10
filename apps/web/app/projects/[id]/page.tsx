"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';

interface Project {
    id: string;
    name: string;
    developer: string;
    location: string;
    price_range: string;
    image: string;
    trust_score: number;
    coordinates?: number[];
    amenities?: string[];
    description?: string;
    vastu_compliance?: any;
    floor_plans?: any[];
    financials?: any;
    specifications?: any;
    audit_trail?: any[];
}

export default function ProjectDetails({ params }: { params: { id: string } }) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('OVERVIEW');
    const [isConfidenceMode, setConfidenceMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:8000/projects/feed');
                const data = await res.json();
                const found = data.find((p: Project) => p.id === params.id);

                if (found) {
                    found.amenities = ["Clubhouse (50k sft)", "Swimming Pool", "Gym", "Cricket Pitch", "Tennis Court", "Spa"];
                    found.description = `Experience luxury living at ${found.name}. Located in the prime area of ${found.location}, this project by ${found.developer} offers world-class amenities and excellent connectivity to the financial district. Verified by PropMubi Trust OS.`;

                    // VASTU (Schema: VASTU_SCHEMA)
                    found.vastu_compliance = {
                        score: 88, verdict: "Highly Auspicious",
                        zones: [
                            { zone: 'Master Bed', direction: 'South-West (SW)', status: 'PERFECT', icon: '🛏️' },
                            { zone: 'Kitchen', direction: 'South-East (SE)', status: 'PERFECT', icon: '🔥' },
                            { zone: 'Entrance', direction: 'North (N)', status: 'PERFECT', icon: '🚪' }
                        ]
                    };

                    // AUDIT TRAIL / TRUST ARTIFACTS (Schema: LEGAL, INSPECTION, RERA)
                    found.audit_trail = [
                        { id: 'ART-001', type: 'LEGAL', title: 'Title Search & Lien Check', status: 'VERIFIED', date: 'Dec 2023', agency: 'PropMubi Legal' },
                        { id: 'ART-002', type: 'QUALITY', title: 'Civil & Structure Audit', status: 'PASS (94%)', date: 'Jan 2024', agency: 'PropMubi Inspection' },
                        { id: 'ART-003', type: 'REGULATORY', title: 'RERA Compliance Audit', status: 'ACTIVE', date: 'Ongoing', agency: 'TS RERA Auditor' }
                    ];

                    // FLOOR PLANS (Schema: HOME_LAYOUT, TOWER_STRUCTURE)
                    found.floor_plans = [
                        { id: '3BHK', name: 'Premium 3BHK', area: '1925 sft', group: 'Premium Towers (Block A-F)', range: 'Floors 1-30' },
                        { id: 'SKY', name: 'Sky Villa Duplex', area: '4500 sft', group: 'Private Penthouses', range: 'Floors 31-35' }
                    ];

                    // FINANCIALS (Schema: PAYMENT_SCHEDULE, PRICE_SHEET)
                    found.financials = {
                        base_price: '₹ 6,500 / sft',
                        total_est: '₹ 1.35 Cr',
                        schedule: [
                            { stage: 'Booking', pct: '10%', amount: '₹ 13.5 L', status: 'PAID' },
                            { stage: 'Excavation', pct: '15%', amount: '₹ 20.2 L', status: 'PAID' },
                            { stage: 'Plinth Level', pct: '10%', amount: '₹ 13.5 L', status: 'DUE' }
                        ]
                    };

                    // SPECS (Schema: ELECTRICAL, PLUMBING, WALL_FINISHES)
                    found.specifications = {
                        structure: { type: 'RCC Shear Wall', walls: 'AAC Block & RCC' },
                        electrical: { brand: 'Legrand / Schneider', sockets: 'Universal 3-Pin' },
                        plumbing: { fittings: 'Kohler / Jaquar', pipes: 'CPVC (A-Class)' },
                        finish: { paint: 'Royale Luxury Emulsion', doors: 'Teak Wood Main' }
                    };

                    setProject(found);
                }
            } catch (e) { console.error("Error", e); } finally { setLoading(false); }
        };
        fetchData();
    }, [params.id]);

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Synchronizing Trust OS...</div>;
    if (!project) return <div style={{ padding: 40, textAlign: 'center' }}>Project Not Found</div>;

    const tabs = [
        { id: 'OVERVIEW', label: '📖 Overview' },
        { id: 'PLANS', label: '📐 Layouts' },
        { id: 'SPECS', label: '🏗️ Tech Specs' },
        { id: 'FINANCIALS', label: '💰 Financials' },
        { id: 'AUDIT', label: '🛡️ Trust & Audit' },
        { id: 'MAP', label: '📍 Location' }
    ];

    return (
        <div style={{ background: '#f0f4f8', minHeight: '100vh', paddingBottom: 100 }}>
            {/* STICKY HEADER */}
            <div style={{ background: 'white', padding: '15px 40px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000 }}>
                <Link href="/consumer" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 'bold' }}>
                    ← Back to Market
                </Link>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    <div style={{ padding: '8px 15px', background: '#ecfdf5', color: '#059669', borderRadius: 20, fontSize: 12, fontWeight: 'bold', border: '1px solid #10b981' }}>
                        ● LIVE INVENTORY SYNCED
                    </div>
                </div>
            </div>

            <div className="grid-layout" style={{ maxWidth: 1400, margin: '30px auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 420px', gap: 30, padding: '0 40px' }}>

                {/* LEFT: CONTENT */}
                <div style={{ background: 'white', borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
                    <img src={project.image} style={{ width: '100%', height: 450, objectFit: 'cover' }} />

                    {/* TABS */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', padding: '0 30px' }}>
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                style={{
                                    padding: '24px 20px', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? '4px solid #2563eb' : '4px solid transparent',
                                    color: activeTab === tab.id ? '#1e293b' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1
                                }}> {tab.label} </button>
                        ))}
                    </div>

                    <div style={{ padding: 50 }}>
                        {/* OVERVIEW */}
                        {activeTab === 'OVERVIEW' && (
                            <div>
                                <h1 style={{ fontSize: 42, color: '#1e293b', marginBottom: 10 }}>{project.name}</h1>
                                <p style={{ fontSize: 20, color: '#64748b', marginBottom: 40 }}>{project.location} · {project.developer} · <span style={{ color: '#2563eb' }}>Trust OS Verified</span></p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 50 }}>
                                    <OverviewMetric label="Trust Score" value={`${project.trust_score}%`} sub="Real-time Audit" color="#059669" />
                                    <OverviewMetric label="Ownership" value="Freehold" sub="Legally Verified" color="#1e293b" />
                                    <OverviewMetric label="Staging" value="Public Release" sub="Current Phase" color="#2563eb" />
                                </div>

                                <p style={{ lineHeight: 1.8, color: '#334155', fontSize: 17, marginBottom: 40 }}>{project.description}</p>

                                <h3 style={{ marginBottom: 20 }}>Curated Amenities</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                                    {project.amenities?.map(am => (
                                        <div key={am} style={{ padding: 18, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', gap: 12 }}>
                                            <span style={{ color: '#2563eb' }}>✦</span> {am}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* AUDIT & TRUST (Schema Manifestation) */}
                        {activeTab === 'AUDIT' && (
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 30 }}>
                                    <div>
                                        <h3 style={{ marginBottom: 25 }}>Trust Artifact Audits</h3>
                                        {project.audit_trail?.map(art => (
                                            <div key={art.id} style={{ marginBottom: 20, padding: 25, borderRadius: 16, border: '1px solid #e2e8f0', position: 'relative' }}>
                                                <div style={{ position: 'absolute', top: 25, right: 25, padding: '5px 12px', background: art.status.includes('VERIFIED') || art.status.includes('PASS') ? '#dcfce7' : '#fef9c3', color: art.status.includes('VERIFIED') || art.status.includes('PASS') ? '#166534' : '#854d0e', borderRadius: 20, fontSize: 11, fontWeight: 'bold' }}>
                                                    {art.status}
                                                </div>
                                                <div style={{ color: '#94a3b8', fontSize: 11, textTransform: 'uppercase', marginBottom: 5 }}>{art.type} Audit</div>
                                                <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{art.title}</div>
                                                <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#64748b' }}>
                                                    <span>📅 {art.date}</span>
                                                    <span>🏛️ Agency: {art.agency}</span>
                                                </div>
                                                <button style={{ marginTop: 15, background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', fontSize: 13, cursor: 'pointer', padding: 0 }}>View Validation Certificate →</button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Vastu Detail sidebar */}
                                    <div style={{ background: '#fffbeb', borderRadius: 24, padding: 30, border: '1px solid #fde68a' }}>
                                        <h3 style={{ margin: '0 0 20px 0', color: '#92400e' }}>🕉️ Vastu Compliance</h3>
                                        <div style={{ fontSize: 40, fontWeight: 'bold', color: '#92400e', marginBottom: 5 }}>{project.vastu_compliance.score}</div>
                                        <div style={{ fontSize: 14, color: '#b45309', marginBottom: 30 }}>{project.vastu_compliance.verdict}</div>

                                        {project.vastu_compliance.zones.map((z: any) => (
                                            <div key={z.zone} style={{ marginBottom: 20, padding: 15, background: 'white', borderRadius: 12, display: 'flex', gap: 15, alignItems: 'center' }}>
                                                <div style={{ fontSize: 24 }}>{z.icon}</div>
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 'bold' }}>{z.zone} ({z.direction})</div>
                                                    <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 'bold' }}>{z.status}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TECH SPECS */}
                        {activeTab === 'SPECS' && project.specifications && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 25 }}>
                                <SpecCard title="⚒️ Structure & Shell" data={project.specifications.structure} />
                                <SpecCard title="🔌 Electrical & Smart Home" data={project.specifications.electrical} />
                                <SpecCard title="🚿 Plumbing & Systems" data={project.specifications.plumbing} />
                                <SpecCard title="✨ Finishes" data={project.specifications.finish} />
                            </div>
                        )}

                        {/* LAYOUTS */}
                        {activeTab === 'PLANS' && (
                            <div>
                                <h3 style={{ marginBottom: 30 }}>Vertical Inventory Stacking</h3>
                                {project.floor_plans?.map(p => (
                                    <div key={p.id} style={{ border: '1px solid #e2e8f0', padding: 25, borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>{p.name} ({p.area})</div>
                                            <div style={{ color: '#64748b', fontSize: 14 }}>{p.group} · <span style={{ color: '#2563eb' }}>{p.range}</span></div>
                                        </div>
                                        <button style={{ padding: '12px 25px', background: '#1e293b', color: 'white', border: 'none', borderRadius: 12, fontWeight: 'bold', cursor: 'pointer' }}>Enter 3D Model</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* FINANCIALS */}
                        {activeTab === 'FINANCIALS' && project.financials && (
                            <div>
                                <h3 style={{ marginBottom: 30 }}>Canonical Pricing Model</h3>
                                <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
                                    <div style={{ flex: 1, padding: 30, background: '#f0f9ff', borderRadius: 20 }}>
                                        <div style={{ color: '#0369a1', fontSize: 12, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 }}>Base Market Rate</div>
                                        <div style={{ fontSize: 28, fontWeight: 'bold', color: '#0c4a6e' }}>{project.financials.base_price}</div>
                                    </div>
                                    <div style={{ flex: 1, padding: 30, background: '#f0fdf4', borderRadius: 20 }}>
                                        <div style={{ color: '#15803d', fontSize: 12, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 }}>Negotiation Invariant</div>
                                        <div style={{ fontSize: 28, fontWeight: 'bold', color: '#14532d' }}>FIXED (No Hidden Cost)</div>
                                    </div>
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <tr style={{ textAlign: 'left', color: '#94a3b8', fontSize: 12, borderBottom: '2px solid #f1f5f9' }}>
                                        <th style={{ padding: 20 }}>Milestone Stage</th>
                                        <th style={{ padding: 20 }}>% Due</th>
                                        <th style={{ padding: 20 }}>Legal Status</th>
                                    </tr>
                                    {project.financials.schedule.map((s: any, i: number) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: 20, fontWeight: 'bold' }}>{s.stage}</td>
                                            <td style={{ padding: 20 }}>{s.pct}</td>
                                            <td style={{ padding: 20 }}><span style={{ color: '#059669', fontWeight: 'bold' }}>✓ {s.status}</span></td>
                                        </tr>
                                    ))}
                                </table>
                            </div>
                        )}

                        {/* MAP */}
                        {activeTab === 'MAP' && project.coordinates && (
                            <div style={{ height: 600, borderRadius: 24, overflow: 'hidden', position: 'relative', border: '1px solid #e2e8f0' }}>
                                <LocationIntelligence lat={project.coordinates[0]} lng={project.coordinates[1]} />
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: CONFIDENCE CARD */}
                <div>
                    <div style={{
                        background: isConfidenceMode ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'white',
                        padding: 40, borderRadius: 32, boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                        position: 'sticky', top: 120, border: isConfidenceMode ? '4px solid #3b82f6' : '1px solid #e2e8f0',
                        color: isConfidenceMode ? 'white' : '#1e293b',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                            <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: isConfidenceMode ? '#94a3b8' : '#64748b' }}>Pricing Matrix</div>
                            {isConfidenceMode && <div style={{ background: '#3b82f6', color: 'white', padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 'bold' }}>SAFE LOCK ON</div>}
                        </div>
                        <div style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 10 }}>{project.price_range}</div>
                        <div style={{ fontSize: 14, color: isConfidenceMode ? '#64748b' : '#94a3b8', marginBottom: 40 }}>All-inclusive estimation. No hidden logic.</div>

                        {/* CONFIDENCE MODE TOGGLE (Requirement LFR-U3) */}
                        <div style={{ marginBottom: 35, padding: 20, background: isConfidenceMode ? 'rgba(59, 130, 246, 0.1)' : '#f8fafc', borderRadius: 16, border: '1px solid ' + (isConfidenceMode ? '#3b82f6' : '#e2e8f0') }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: 14 }}>Confidence Mode</div>
                                    <div style={{ fontSize: 11, color: isConfidenceMode ? '#3b82f6' : '#64748b' }}>Price lock & priority allocation.</div>
                                </div>
                                <button
                                    onClick={() => setConfidenceMode(!isConfidenceMode)}
                                    style={{
                                        width: 50, height: 26, borderRadius: 13, background: isConfidenceMode ? '#3b82f6' : '#cbd5e1',
                                        border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s'
                                    }}>
                                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 4, left: isConfidenceMode ? 28 : 4, transition: '0.3s' }} />
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                            <input placeholder="Full Legal Name" style={{ ...inputStyle, background: isConfidenceMode ? '#0f172a' : '#f8fafc', color: isConfidenceMode ? 'white' : 'black', borderColor: isConfidenceMode ? '#334155' : '#e2e8f0' }} />
                            <input placeholder="Phone (Lead Origin Sync)" style={{ ...inputStyle, background: isConfidenceMode ? '#0f172a' : '#f8fafc', color: isConfidenceMode ? 'white' : 'black', borderColor: isConfidenceMode ? '#334155' : '#e2e8f0' }} />

                            <button style={{ padding: 20, background: isConfidenceMode ? '#3b82f6' : '#1e293b', color: 'white', border: 'none', borderRadius: 16, fontWeight: 'bold', fontSize: 17, cursor: 'pointer', boxShadow: isConfidenceMode ? '0 10px 20px rgba(59, 130, 246, 0.4)' : 'none' }}>
                                {isConfidenceMode ? '🔒 Lock Price & Finalize' : 'Initiate Truth Discussion'}
                            </button>

                            <Link href={`/projects/${project.id}/twin`} style={{ textDecoration: 'none' }}>
                                <button style={{ width: '100%', padding: 18, background: 'transparent', color: isConfidenceMode ? '#3b82f6' : '#2563eb', border: '2px solid' + (isConfidenceMode ? '#3b82f6' : '#2563eb'), borderRadius: 16, fontWeight: 'bold', cursor: 'pointer' }}>🌐 Full Digital Twin Access</button>
                            </Link>
                        </div>
                        <p style={{ marginTop: 30, fontSize: 12, color: isConfidenceMode ? '#475569' : '#94a3b8', textAlign: 'center', lineHeight: 1.6 }}>
                            PropMubi Trust OS enforces **Consent-Driven Communication** (LFR-L2). No unsolicited calls.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OverviewMetric({ label, value, sub, color }: any) {
    return (
        <div style={{ background: '#f8fafc', padding: 25, borderRadius: 20, border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ color: '#94a3b8', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: color, marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{sub}</div>
        </div>
    );
}

function SpecCard({ title, data }: any) {
    return (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, padding: 30 }}>
            <h4 style={{ margin: '0 0 20px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: 15, fontSize: 18 }}>{title}</h4>
            {Object.entries(data).map(([k, v]: any) => (
                <div key={k} style={{ marginBottom: 15 }}>
                    <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1 }}>{k}</div>
                    <div style={{ fontSize: 15, fontWeight: 'bold', color: '#1e293b' }}>{v}</div>
                </div>
            ))}
        </div>
    );
}

function LocationIntelligence({ lat, lng }: { lat: number, lng: number }) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";
    return (
        <APIProvider apiKey={apiKey}>
            <Map defaultCenter={{ lat, lng }} defaultZoom={17} mapTypeId={'satellite'} mapId={'DEMO_MAP_ID'} tilt={45} style={{ width: '100%', height: '100%' }}>
                <AdvancedMarker position={{ lat, lng }}>
                    <div style={{ background: '#ef4444', color: 'white', padding: '10px 15px', borderRadius: 12, fontWeight: 'bold', border: '4px solid white', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                        📍 Project Center
                    </div>
                </AdvancedMarker>
                <AdvancedMarker position={{ lat: lat + 0.003, lng: lng + 0.003 }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.9)', color: 'white', padding: '6px 14px', borderRadius: 30, fontSize: 11, fontWeight: 'bold' }}>🌊 Environmental Layer: Lake</div>
                </AdvancedMarker>
            </Map>
        </APIProvider>
    );
}

const inputStyle = {
    padding: '20px 24px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    background: '#f8fafc',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box' as any,
    transition: '0.3s'
};
