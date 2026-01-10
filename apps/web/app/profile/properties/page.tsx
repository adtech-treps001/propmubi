"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

export default function MyPropertiesPage() {
    const [activeTab, setActiveTab] = useState<'PORTFOLIO' | 'SURVEILLANCE' | 'VAULT'>('PORTFOLIO');
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'sans-serif' }}>
            {/* Header */}
            <div style={{ padding: '20px 40px', background: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 24, background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        My Asset Command Center
                    </h1>
                    <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>PropMubi Trust OS • Lakewood Family Trust</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <TabButton label="🏢 Portfolio" active={activeTab === 'PORTFOLIO'} onClick={() => setActiveTab('PORTFOLIO')} />
                    <TabButton label="👁️ Sentinel View" active={activeTab === 'SURVEILLANCE'} onClick={() => setActiveTab('SURVEILLANCE')} />
                    <TabButton label="🔒 Doc Safe" active={activeTab === 'VAULT'} onClick={() => setActiveTab('VAULT')} />
                </div>
            </div>

            <div style={{ padding: 40 }}>
                {activeTab === 'PORTFOLIO' && <PortfolioView />}
                {activeTab === 'SURVEILLANCE' && <SurveillanceView apiKey={apiKey} />}
                {activeTab === 'VAULT' && <VaultView />}
            </div>
        </div>
    );
}

function TabButton({ label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '10px 20px',
                background: active ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(255,255,255,0.05)',
                border: '1px solid',
                borderColor: active ? '#60a5fa' : 'rgba(255,255,255,0.1)',
                color: active ? 'white' : '#94a3b8',
                borderRadius: 30,
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
            }}
        >
            {label}
        </button>
    );
}

function PortfolioView() {
    const properties = [
        { id: 1, name: "My Home Sayuk - Tower 4", type: "Premium Apartment", loc: "Tellapur, Hyderabad", val: "₹ 1.2 Cr", status: "Under Construction", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80" },
        { id: 2, name: "Plot 45, Golden Mile", type: "Villa Plot", loc: "Kokapet, Hyderabad", val: "₹ 3.5 Cr", status: "Ready to Build", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80" },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 30 }}>
            {properties.map(p => (
                <div key={p.id} style={{
                    background: '#1e293b', borderRadius: 16, overflow: 'hidden', border: '1px solid #334155',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)', transition: 'transform 0.2s'
                }}>
                    <div style={{ height: 180, overflow: 'hidden' }}>
                        <img src={p.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                            <span style={{ fontSize: 12, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '4px 8px', borderRadius: 4 }}>{p.type}</span>
                            <span style={{ fontSize: 12, color: p.status.includes('Ready') ? '#2ecc71' : '#f1c40f' }}>{p.status}</span>
                        </div>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: 18 }}>{p.name}</h3>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: 13 }}>📍 {p.loc}</p>
                        <div style={{ marginTop: 20, paddingTop: 15, borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 20, fontWeight: 'bold' }}>{p.val}</span>
                            <Link href="/projects/100/twin">
                                <button style={{ padding: '8px 16px', background: '#334155', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Manage Twin →</button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function SurveillanceView({ apiKey }: { apiKey: string }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 30, height: '70vh' }}>
            {/* Main Feed */}
            <div style={{ background: '#000', borderRadius: 16, overflow: 'hidden', position: 'relative', border: '2px solid #334155' }}>
                <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, background: 'rgba(255,0,0,0.6)', padding: '5px 10px', borderRadius: 4, color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                    ● LIVE CAME-04
                </div>
                <img
                    src="https://images.unsplash.com/photo-1583030222045-84e937d6cc79?auto=format&fit=crop&w=1200&q=80"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, background: 'linear-gradient(transparent, black)' }}>
                    <h3 style={{ margin: 0 }}>Perimeter South - Construction Gate</h3>
                    <p style={{ color: '#94a3b8', fontSize: 12 }}>Motion Detected: 2 mins ago (Truck Entry)</p>
                </div>
            </div>

            {/* Satellite & Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ flex: 1, background: '#1e293b', borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, background: 'rgba(56, 189, 248, 0.8)', padding: '5px 10px', borderRadius: 4, color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                        🛰️ SAT-LINK
                    </div>
                    <APIProvider apiKey={apiKey}>
                        <Map
                            defaultCenter={{ lat: 17.46, lng: 78.29 }}
                            defaultZoom={16}
                            mapTypeId={'satellite'}
                            disableDefaultUI={true}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </APIProvider>
                </div>

                <div style={{ background: '#1e293b', padding: 20, borderRadius: 16 }}>
                    <h3 style={{ marginTop: 0, fontSize: 14, color: '#94a3b8' }}>CAMERA CONTROLS</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <ControlBtn icon="◀" label="Pan Left" />
                        <ControlBtn icon="▶" label="Pan Right" />
                        <ControlBtn icon="🔍" label="Zoom In" />
                        <ControlBtn icon="📸" label="Snapshot" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ControlBtn({ icon, label }: any) {
    return (
        <button style={{ padding: 15, background: '#334155', border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontSize: 11 }}>{label}</span>
        </button>
    );
}

function VaultView() {
    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
                <DocFolder name="Property Deeds" items={3} color="#f59e0b" />
                <DocFolder name="Govt Approvals" items={12} color="#10b981" />
                <DocFolder name="Tax Receipts" items={5} color="#3b82f6" />
                <DocFolder name="Loan Docs" items={2} color="#ec4899" />
            </div>

            <h3 style={{ marginTop: 40, color: '#94a3b8', borderBottom: '1px solid #334155', paddingBottom: 10 }}>Recent Uploads</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
                <tbody>
                    <DocRow name="Sale_Deed_Final_Signed.pdf" date="Oct 12, 2024" size="4.2 MB" badge="Verified" />
                    <DocRow name="EC_Certificate_2024.pdf" date="Nov 01, 2024" size="1.1 MB" badge="Verified" />
                    <DocRow name="Site_Video_Walkthrough.mp4" date="Yesterday" size="45 MB" badge="Processing" />
                </tbody>
            </table>
        </div>
    );
}

function DocFolder({ name, items, color }: any) {
    return (
        <div style={{ background: '#1e293b', padding: 20, borderRadius: 16, border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 15 }}>
            <div style={{ width: 50, height: 50, borderRadius: 12, background: `${color}20`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                📂
            </div>
            <div>
                <div style={{ fontWeight: 'bold' }}>{name}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{items} Documents</div>
            </div>
        </div>
    );
}

function DocRow({ name, date, size, badge }: any) {
    return (
        <tr style={{ borderBottom: '1px solid #1e293b' }}>
            <td style={{ padding: 15, display: 'flex', gap: 10, alignItems: 'center' }}>
                <span>📄</span> {name}
            </td>
            <td style={{ padding: 15, color: '#94a3b8', fontSize: 13 }}>{date}</td>
            <td style={{ padding: 15, color: '#94a3b8', fontSize: 13 }}>{size}</td>
            <td style={{ padding: 15 }}>
                <span style={{
                    padding: '4px 8px', borderRadius: 4, fontSize: 11,
                    background: badge === 'Verified' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                    color: badge === 'Verified' ? '#22c55e' : '#eab308'
                }}>
                    {badge}
                </span>
            </td>
        </tr>
    );
}
