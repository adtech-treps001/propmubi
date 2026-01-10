"use client";

import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function BuilderDashboard() {
    const [stats, setStats] = useState({ verified_leads: 0, unverified_leads: 0, trust_score: 0 });
    const [projectData, setProjectData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('HOME');

    const fetchStats = async () => {
        try {
            const res = await fetch('http://localhost:8000/dashboard/stats');
            const data = await res.json();
            setStats(data);

            setProjectData({
                activeProjects: 3,
                totalUnits: 450,
                unitsBooked: 287,
                deliveryOnTime: 94,
                legalCompliance: 98
            });
        } catch (e) { console.error("API Error", e); }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    const tabs = [
        { id: 'HOME', label: 'Dashboard', icon: '📊' },
        { id: 'INVENTORY', label: 'Inventory Staging', icon: '🏢' },
        { id: 'UPDATES', label: 'Updates & Sync', icon: '🔄' },
        { id: 'TRUST', label: 'Trust Assets', icon: '🛡️' },
        { id: 'AGENTS', label: 'Agent Network', icon: '🤝' },
        { id: 'MARKETING', label: 'AI Marketing', icon: '🤖' },
    ];

    return (
        <div style={{ padding: 40, fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', minHeight: '100vh', color: '#f8fafc' }}>
            {/* Header */}
            <div style={{ background: 'white', borderRadius: 24, padding: '25px 40px', marginBottom: 40, boxShadow: '0 20px 50px rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 32, color: '#0f172a' }}>PropMubi Builder OS</h1>
                    <p style={{ color: '#64748b', marginTop: 8, margin: 0 }}>System of Truth · Inventory & Trust Management</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '12px 24px',
                                border: 'none',
                                background: activeTab === tab.id ? '#2563eb' : '#f1f5f9',
                                color: activeTab === tab.id ? 'white' : '#64748b',
                                borderRadius: 12,
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex', gap: 10, alignItems: 'center',
                                transition: '0.2s'
                            }}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'HOME' && <DashboardHome stats={stats} projectData={projectData} />}
            {activeTab === 'INVENTORY' && <InventoryManager />}
            {activeTab === 'UPDATES' && <ProjectSyncView />}
            {activeTab === 'AGENTS' && <AgentNetworkView />}
            {activeTab === 'MARKETING' && <AIMarketingView />}
        </div>
    );
}

function DashboardHome({ stats, projectData }: any) {
    const trustImpactData = {
        labels: ['Lead Quality'],
        datasets: [
            { label: 'Verified Buyers (Consent Locked)', data: [stats.verified_leads], backgroundColor: '#10b981' },
            { label: 'Unverified Intent', data: [stats.unverified_leads], backgroundColor: '#f43f5e' },
        ],
    };

    return (
        <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 30, marginBottom: 40 }}>
                <MetricCard title="Truth Accuracy" value="100%" subtitle="Verified Listings" color="#2563eb" icon="🛡️" />
                <MetricCard title="Buyer Consent Rate" value="92%" subtitle="Phone-Hash Verified" color="#10b981" icon="✅" />
                <MetricCard title="Inventory Staging" value="Dynamic" subtitle="Price Lock Active" color="#f59e0b" icon="🏢" />
                <MetricCard title="Agent Adherence" value="98.4%" subtitle="Rule-Based Compliance" color="#8b5cf6" icon="🤝" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 30 }}>
                <div style={{ background: 'white', borderRadius: 16, padding: 30, height: 400 }}>
                    <h2 style={{ color: '#1e293b', marginBottom: 20 }}>Pipeline Conversion (Trust Weighted)</h2>
                    <Bar data={trustImpactData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
                <div style={{ background: 'white', borderRadius: 16, padding: 30, color: '#1e293b' }}>
                    <h2 style={{ marginBottom: 20 }}>System Activity Log</h2>
                    <ActivityFeed />
                </div>
            </div>
        </>
    );
}

function InventoryManager() {
    const [selectedTower, setSelectedTower] = useState('Tower A');
    const [selectedUnit, setSelectedUnit] = useState<any>(null);

    const floors = Array.from({ length: 15 }, (_, i) => 15 - i);
    const unitsPerFloor = [1, 2, 3, 4];

    // UPDATED STATUSES FROM Full_website.md
    const getUnitStatus = (floor: number, unit: number) => {
        const hash = (floor * 31 + unit) % 100;
        if (hash > 80) return 'PUBLIC';
        if (hash > 60) return 'STAGE_LOCKED';
        if (hash > 40) return 'PREMIUM_RESERVE';
        if (hash > 20) return 'VALUE_OPTIMIZED';
        return 'CLOSED_RELEASE_POOL';
    };

    const statusColors: any = {
        'PUBLIC': '#10b981',
        'STAGE_LOCKED': '#64748b',
        'PREMIUM_RESERVE': '#8b5cf6',
        'VALUE_OPTIMIZED': '#f59e0b',
        'CLOSED_RELEASE_POOL': '#1e293b'
    };

    const handleUnitClick = (floor: number, unit: number, status: string) => {
        setSelectedUnit({
            id: `${selectedTower}-${floor}0${unit}`,
            name: `${selectedTower} - Unit ${floor}0${unit}`,
            floor,
            type: unit <= 2 ? '4BHK' : '3BHK',
            status,
            price: unit <= 2 ? '₹ 2.45 Cr' : '₹ 1.85 Cr',
            trust_artifact: 'VERIFIED',
            audit_id: 'AUD-992-PX'
        });
    };

    return (
        <div style={{ display: 'flex', gap: 30 }}>
            {/* INVENTORY GRID */}
            <div style={{ flex: 2, background: 'white', borderRadius: 24, padding: 40, color: '#1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                        {['Tower A', 'Tower B', 'Tower C', 'Penthouses'].map(t => (
                            <button key={t} onClick={() => setSelectedTower(t)} style={{ padding: '10px 20px', borderRadius: 12, border: '1px solid #e2e8f0', background: selectedTower === t ? '#1e293b' : 'white', color: selectedTower === t ? 'white' : '#64748b', cursor: 'pointer', fontWeight: 'bold' }}>{t}</button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {floors.map(f => (
                        <div key={f} style={{ display: 'flex', gap: 10 }}>
                            <div style={{ width: 50, color: '#94a3b8', fontSize: 12, display: 'flex', alignItems: 'center' }}>Lvl {f}</div>
                            {unitsPerFloor.map(u => {
                                const status = getUnitStatus(f, u);
                                return (
                                    <div key={u} onClick={() => handleUnitClick(f, u, status)} style={{ flex: 1, height: 40, background: statusColors[status], opacity: selectedUnit?.id.includes(`${f}0${u}`) ? 1 : 0.7, border: selectedUnit?.id.includes(`${f}0${u}`) ? '3px solid #000' : 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: 12 }}>{f}0{u}</div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 30, display: 'flex', gap: 20, fontSize: 12, color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
                    {Object.entries(statusColors).map(([status, color]: any) => (
                        <div key={status} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <div style={{ width: 12, height: 12, borderRadius: 2, background: color }} />
                            <span>{status}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* INSPECTOR */}
            <div style={{ flex: 1 }}>
                {selectedUnit ? (
                    <div style={{ background: 'white', borderRadius: 24, padding: 30, color: '#1e293b', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
                        <h2>{selectedUnit.name}</h2>
                        <div style={{ padding: '8px 12px', background: statusColors[selectedUnit.status], color: 'white', borderRadius: 8, display: 'inline-block', fontWeight: 'bold', fontSize: 12, marginBottom: 25 }}>{selectedUnit.status}</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                            <DetailRow label="Configuration" value={selectedUnit.type} />
                            <DetailRow label="Est. Price" value={selectedUnit.price} />
                            <DetailRow label="Trust Artifact" value={selectedUnit.trust_artifact} color="#10b981" />
                            <DetailRow label="Audit ID" value={selectedUnit.audit_id} />
                        </div>

                        <div style={{ marginTop: 30, borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
                            <h4 style={{ marginBottom: 15 }}>Staging Strategy Control (LFR-B1)</h4>
                            <select style={{ width: '100%', padding: 15, borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 'bold' }}>
                                <option>Switch to PREMIUM_RESERVE</option>
                                <option>Switch to STAGE_LOCKED</option>
                                <option>Switch to VALUE_OPTIMIZED</option>
                            </select>
                            <button style={{ width: '100%', marginTop: 15, padding: 15, background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => alert('Inventory State Changed & Logged in Audit Trail.')}>Apply Canonical Change</button>
                        </div>
                    </div>
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.1)', border: '2px dashed rgba(255,255,255,0.2)', height: 400, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40 }}>
                        <p>Select a Unit from the grid to manage Staging Strategy & Trust Artifacts.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function DetailRow({ label, value, color }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
            <span style={{ color: '#94a3b8', fontSize: 14 }}>{label}</span>
            <span style={{ fontWeight: 'bold', color: color || '#1e293b' }}>{value}</span>
        </div>
    );
}

function MetricCard({ title, value, subtitle, color, icon }: any) {
    return (
        <div style={{ background: 'white', borderRadius: 20, padding: 30, color: '#1e293b', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 32 }}>{icon}</div>
            <div style={{ color: '#94a3b8', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{title}</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color, margin: '10px 0' }}>{value}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{subtitle}</div>
        </div>
    );
}

function ActivityFeed() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <ActivityItem text="Trust Artifact ART-001 Verified by Legal" time="2m ago" />
            <ActivityItem text="Lead Priya S. - Consent Locked - Priority assigned" time="15m ago" />
            <ActivityItem text="Unit T-A-1502 moved to PREMIUM_RESERVE" time="1h ago" />
            <ActivityItem text="Price Lock initiated for My Home Sayuk Prototype" time="3h ago" />
        </div>
    );
}

function ActivityItem({ text, time }: any) {
    return (
        <div style={{ padding: 15, background: '#f8fafc', borderRadius: 12, borderLeft: '4px solid #2563eb' }}>
            <div style={{ fontSize: 14, fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 5 }}>{time}</div>
        </div>
    );
}

function ProjectSyncView() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
            <div style={{ background: 'white', borderRadius: 24, padding: 40, color: '#1e293b' }}>
                <h2>Live Progress Sync</h2>
                <div style={{ marginTop: 20, padding: 30, border: '2px dashed #2563eb', borderRadius: 16, background: '#f0f9ff', textAlign: 'center', color: '#2563eb', cursor: 'pointer' }}>
                    📷 Upload Site Photos (Audit Ready)
                </div>
                <button style={{ width: '100%', marginTop: 20, padding: 15, background: '#1e293b', color: 'white', borderRadius: 12, fontWeight: 'bold' }}>Push Update to Buyer Profiles</button>
            </div>
            <div style={{ background: 'white', borderRadius: 24, padding: 40, color: '#1e293b' }}>
                <h2>Digital Twin Health</h2>
                <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><span>LOD Accuracy</span> <strong>350</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sync Status</span> <strong style={{ color: '#10b981' }}>Live</strong></div>
                </div>
            </div>
        </div>
    );
}

function AgentNetworkView() {
    return (
        <div style={{ background: 'white', borderRadius: 24, padding: 40, color: '#1e293b' }}>
            <h2>Canonical Agent Network</h2>
            <p style={{ color: '#64748b' }}>Agents are assigned based on performance & trust alignment (LFR-A5).</p>
            <table style={{ width: '100%', marginTop: 30 }}>
                <tr style={{ textAlign: 'left', color: '#94a3b8', fontSize: 12 }}>
                    <th>Advisor</th>
                    <th>Leads Assigned</th>
                    <th>Conversion (Consent)</th>
                    <th>Audit Status</th>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '15px 0' }}><strong>Rahul Sharma</strong></td>
                    <td>12</td>
                    <td style={{ color: '#10b981', fontWeight: 'bold' }}>8.4%</td>
                    <td><span style={{ padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: 4, fontSize: 10 }}>COMPLIANT</span></td>
                </tr>
            </table>
        </div>
    );
}

function AIMarketingView() {
    return (
        <div style={{ background: 'white', borderRadius: 24, padding: 40, color: '#1e293b' }}>
            <h2>AI Marketing Governance</h2>
            <p style={{ color: '#64748b' }}>AI reasons only over verified listings (LFR-AI1). No hallucinations allowed.</p>
            <div style={{ marginTop: 20, height: 200, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#94a3b8' }}>AI Content Engine Offline (Compliance Check Pending)</p>
            </div>
        </div>
    );
}
