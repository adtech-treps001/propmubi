"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('../../components/AgentMap'), { ssr: false });

export default function AgentCRM() {
    const [leads, setLeads] = useState([]);
    const [softSupply, setSoftSupply] = useState([]);
    const [stats, setStats] = useState({ active: 0, commission: 0 });
    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'LIST' | 'MAP' | 'MARKETING' | 'SERVICES'>('LIST');
    const agentId = "agent-123";

    const fetchData = async () => {
        try {
            const resLeads = await fetch(`http://localhost:8000/crm/leads/queue/${agentId}`);
            const dataLeads = await resLeads.json();
            setLeads(Array.isArray(dataLeads) ? dataLeads : []);

            const resSupply = await fetch(`http://localhost:8000/agent/listings`);
            const dataSupply = await resSupply.json();
            setSoftSupply(dataSupply || []);

            const resStats = await fetch(`http://localhost:8000/crm/commissions/${agentId}`);
            const dataStats = await resStats.json();
            setStats({ active: dataLeads.length, commission: dataStats.pending_amount });

        } catch (e) { console.error("API Error", e); }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ padding: 40, fontFamily: 'sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh', color: '#1c1e21' }}>
            {/* AGENT HEADER (Aligned with Full_website.md Invariants) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 32 }}>Advisor Command Center</h1>
                    <p style={{ color: '#65676b', fontSize: 14 }}>One Property · One Advisor · <span style={{ color: '#2563eb', fontWeight: 'bold' }}>One Truth</span></p>
                </div>
                <div style={{ background: 'white', padding: 6, borderRadius: 12, display: 'flex', gap: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <TabButton label="📋 Lead Queue" active={viewMode === 'LIST'} onClick={() => setViewMode('LIST')} />
                    <TabButton label="🗺️ Market Map" active={viewMode === 'MAP'} onClick={() => setViewMode('MAP')} />
                    <TabButton label="🤖 AI Studio" active={viewMode === 'MARKETING'} onClick={() => setViewMode('MARKETING')} color="#8b5cf6" />
                    <TabButton label="🧩 Service Hub" active={viewMode === 'SERVICES'} onClick={() => setViewMode('SERVICES')} color="#f59e0b" />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }}>
                <MetricCard title="Protected Leads" value={stats.active || 0} icon="👤" color="#2563eb" />
                <MetricCard title="Commission Invariant" value={`₹${(stats.commission || 0).toLocaleString()}`} icon="💰" color="#10b981" />
                <MetricCard title="Consent Health" value="98%" icon="✅" color="#f59e0b" />
            </div>

            {viewMode === 'LIST' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 30 }}>
                    <div style={{ background: 'white', padding: 30, borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ marginBottom: 20 }}>Protected Lead Queue</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tr style={{ textAlign: 'left', color: '#8a8d91', fontSize: 12, borderBottom: '1px solid #ebedf0' }}>
                                <th style={{ padding: 15 }}>Buyer Consent ID</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            {leads.map((l: any) => (
                                <tr key={l.id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                                    <td style={{ padding: 15, fontSize: 13, fontWeight: 'bold' }}>{l.buyer_id.substring(0, 12)}...</td>
                                    <td><span style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11, background: '#dcfce7', color: '#166534', fontWeight: 'bold' }}>LOCKED</span></td>
                                    <td><button onClick={() => setSelectedLead(l)} style={{ padding: '8px 15px', background: '#1c1e21', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Engage</button></td>
                                </tr>
                            ))}
                        </table>
                    </div>

                    <div style={{ background: 'white', padding: 30, borderRadius: 20, border: '1px solid #e2e8f0' }}>
                        <h2>Supply Sensors</h2>
                        <p style={{ color: '#65676b', fontSize: 14 }}>Real-time inventory changes detected in your micro-market.</p>
                        {softSupply.slice(0, 3).map((s: any) => (
                            <div key={s.id} style={{ padding: 20, background: '#f8f9fa', borderRadius: 12, marginBottom: 15 }}>
                                <div style={{ fontWeight: 'bold' }}>{s.property_details.property_name}</div>
                                <div style={{ fontSize: 12, color: '#65676b' }}>{s.property_details.location} · ₹{s.property_details.price.toLocaleString()}</div>
                                <div style={{ marginTop: 10, fontSize: 11, color: '#2563eb', fontWeight: 'bold' }}>● AI: HIGH INTENT DETECTED</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {viewMode === 'SERVICES' && <DigitalServicesHub />}
            {viewMode === 'MAP' && <div style={{ height: 600, background: 'white', borderRadius: 20, overflow: 'hidden' }}><MapView leads={leads} supply={softSupply} /></div>}
            {viewMode === 'MARKETING' && <AgentAIStudio />}

            {selectedLead && <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}
        </div>
    );
}

function DigitalServicesHub() {
    return (
        <div>
            <div style={{ marginBottom: 30 }}>
                <h2 style={{ color: '#1c1e21' }}>Digital Services Ecosystem</h2>
                <p style={{ color: '#65676b' }}>Standardized backends for communication, KYC, and fintech compliance.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>

                {/* Categorized per service_providers.yaml */}
                <ServiceCard
                    emoji="💬"
                    title="Communication & Bots"
                    description="Enterprise API for WhatsApp & SMS automation."
                    status="Active"
                    integrations={['Gupshup', 'MSG91', 'Twilio', 'Infobip']}
                />

                <ServiceCard
                    emoji="🔐"
                    title="Identity & Consent"
                    description="Aadhar e-KYC and global document verification."
                    status="Active"
                    integrations={['Signzy', 'Persona', 'Sumsub', 'DigiLocker']}
                />

                <ServiceCard
                    emoji="💳"
                    title="Payment & FinTech"
                    description="UPI/Credit processing and loan origination."
                    status="Active"
                    integrations={['Razorpay', 'Stripe', 'PhonePe', 'SBI/HDFC']}
                />

                <ServiceCard
                    emoji="⚖️"
                    title="Legal & Trust Artifacts"
                    description="e-Stamping, Title Search, and NeSL integration."
                    status="Active"
                    integrations={['Leegality', 'DocuSign', 'IGRS', 'NeSL']}
                />

                <ServiceCard
                    emoji="📊"
                    title="Tax & Compliance"
                    description="GST Automation & Capital Gains audit (54/54F)."
                    status="Beta"
                    integrations={['Stripe Tax', 'Avalara', 'ClearTax', 'QuickBooks']}
                />

                <ServiceCard
                    emoji="🏗️"
                    title="Inspection & Quality"
                    description="Third-party structural & finishing audits."
                    status="Active"
                    integrations={['PropMubi Inspection', 'AccuCheck', 'CivilAudit']}
                />

                <ServiceCard
                    emoji="📈"
                    title="Market Intelligence"
                    description="Micro-market trends, absorption rates & pricing intel."
                    status="Active"
                    integrations={['Knight Frank', 'JLL', 'Anarock', 'PropEquity', 'Liases Foras']}
                />
            </div>
        </div>
    );
}

function ServiceCard({ emoji, title, description, status, integrations }: any) {
    return (
        <div style={{ background: 'white', padding: 30, borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontSize: 36 }}>{emoji}</span>
                <span style={{ padding: '6px 12px', background: status === 'Active' ? '#eafaf1' : '#fcf3cf', color: status === 'Active' ? '#166534' : '#92400e', borderRadius: 8, fontSize: 11, fontWeight: 'bold' }}>{status}</span>
            </div>
            <h3 style={{ margin: '0 0 10px 0' }}>{title}</h3>
            <p style={{ color: '#65676b', fontSize: 14, lineHeight: 1.5, flex: 1 }}>{description}</p>
            <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {integrations.map((i: any) => <span key={i} style={{ padding: '4px 8px', background: '#f0f2f5', borderRadius: 6, fontSize: 11, color: '#1c1e21' }}>{i}</span>)}
            </div>
            <button style={{ marginTop: 25, width: '100%', padding: 12, background: '#1c1e21', color: 'white', borderRadius: 12, fontWeight: 'bold', cursor: 'pointer' }}>Manage API</button>
        </div>
    );
}

function TabButton({ label, active, onClick, color }: any) {
    return (
        <button onClick={onClick} style={{
            padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: 13,
            background: active ? (color || '#2563eb') : 'transparent',
            color: active ? 'white' : '#65676b',
            transition: '0.2s'
        }}>{label}</button>
    );
}

function MetricCard({ title, value, icon, color }: any) {
    return (
        <div style={{ background: 'white', padding: 25, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 24, opacity: 0.3 }}>{icon}</div>
            <div style={{ color: '#8a8d91', fontSize: 12, textTransform: 'uppercase', fontWeight: 'bold' }}>{title}</div>
            <div style={{ fontSize: 28, fontWeight: 'bold', color, marginTop: 10 }}>{value}</div>
        </div>
    );
}

function LeadModal({ lead, onClose }: any) {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div style={{ background: 'white', width: 600, borderRadius: 24, padding: 40, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
                    <h2>Advisor Response</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>×</button>
                </div>
                <div style={{ padding: 20, background: '#f0f9ff', borderRadius: 16, border: '1px solid #bae6fd', marginBottom: 25 }}>
                    <div style={{ fontWeight: 'bold', color: '#0369a1' }}>AI Suggestion (LFR-A4)</div>
                    <p style={{ fontSize: 14, color: '#0c4a6e', margin: '10px 0' }}>Buyer is currently in **Confidence Mode**. Send the Verified Agreement template immediately to lock the unit.</p>
                </div>
                <button style={{ width: '100%', padding: 18, background: '#2563eb', color: 'white', borderRadius: 16, fontWeight: 'bold' }}>🚀 Initiate Price Lock Protocol</button>
            </div>
        </div>
    );
}

function AgentAIStudio() {
    return <div style={{ background: 'white', padding: 40, borderRadius: 20, textAlign: 'center' }}><h2>AI Studio</h2><p>Reasoning over verified listings only...</p></div>;
}
