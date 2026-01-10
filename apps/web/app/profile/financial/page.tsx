"use client";

import React, { useState } from 'react';

// Mock integration statuses
const INTEGRATIONS = {
    identity: { aadhaar: true, pan: true, status: 'VERIFIED' },
    credit: { score: 760, band: 'EXCELLENT', checked: '2026-01-09' },
    income: { band: '40k-60k', verified: true, source: 'Account Aggregator' },
    assets: { mf: '15L-25L', property_count: 0 },
    loans: { count: 1, type: 'Car Loan', emi: '₹12k/mo' }
};

export default function FinancialProfilePage() {
    const [showDetails, setShowDetails] = useState(false);

    // Calculate buying power (simplified)
    const buyingPowerMin = 80;
    const buyingPowerMax = 120;
    const confidenceScore = 82;

    return (
        <div style={{ padding: 40, background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <h1 style={{ fontSize: 32, marginBottom: 10 }}>💼 My Financial Profile</h1>
                <p style={{ color: '#64748b', marginBottom: 30 }}>Your verified financial identity for confident home buying</p>

                {/* Confidence Score */}
                <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 30, borderRadius: 16, color: 'white', marginBottom: 30 }}>
                    <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 5 }}>FINANCIAL CONFIDENCE SCORE</div>
                    <div style={{ fontSize: 56, fontWeight: 'bold' }}>{confidenceScore}/100</div>
                    <div style={{ fontSize: 14, marginTop: 10, opacity: 0.9 }}>Based on 5 verified data sources</div>
                </div>

                {/* Integration Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 30 }}>

                    {/* Identity Card */}
                    <IntegrationCard
                        title="Identity Verification"
                        status="VERIFIED"
                        icon="✅"
                        items={[
                            { label: 'Aadhaar', value: 'Verified', color: '#22c55e' },
                            { label: 'PAN', value: 'Verified', color: '#22c55e' }
                        ]}
                    />

                    {/* Credit Score Card */}
                    <IntegrationCard
                        title="Credit Score"
                        status="EXCELLENT"
                        icon="📊"
                        items={[
                            { label: 'CIBIL Score', value: '760', color: '#22c55e' },
                            { label: 'Last Checked', value: 'Jan 9, 2026', color: '#64748b' }
                        ]}
                        action={{ label: 'View Full Report', onClick: () => alert('Premium Feature: ₹99') }}
                    />

                    {/* Income Card */}
                    <IntegrationCard
                        title="Monthly Income"
                        status="VERIFIED"
                        icon="💰"
                        items={[
                            { label: 'Surplus', value: '₹40k-60k', color: '#3b82f6' },
                            { label: 'Source', value: 'Bank Statement', color: '#64748b' }
                        ]}
                    />

                    {/* Assets Card */}
                    <IntegrationCard
                        title="Liquid Assets"
                        status="LINKED"
                        icon="🏦"
                        items={[
                            { label: 'Mutual Funds', value: '₹15L-25L', color: '#3b82f6' },
                            { label: 'Properties', value: '0 owned', color: '#64748b' }
                        ]}
                    />

                    {/* Loans Card */}
                    <IntegrationCard
                        title="Existing Loans"
                        status="WARNING"
                        icon="⚠️"
                        items={[
                            { label: 'Active Loans', value: '1', color: '#f59e0b' },
                            { label: 'Type', value: 'Car Loan', color: '#64748b' },
                            { label: 'EMI', value: '₹12k/mo', color: '#64748b' }
                        ]}
                    />

                </div>

                {/* Buying Power Section */}
                <div style={{ background: 'white', padding: 30, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ marginTop: 0 }}>🏠 Estimated Buying Power</h2>
                    <div style={{ fontSize: 40, fontWeight: 'bold', color: '#22c55e', margin: '20px 0' }}>
                        ₹{buyingPowerMin}L - ₹{buyingPowerMax}L
                    </div>
                    <div style={{ background: '#f1f5f9', padding: 15, borderRadius: 8, fontSize: 14, color: '#475569' }}>
                        <strong>Calculation:</strong> Based on your monthly surplus (₹50k avg), liquid assets (₹20L avg),
                        and credit score (760), you can comfortably afford properties in this range with standard home loan eligibility.
                    </div>

                    <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                        <button style={{
                            flex: 1, padding: 15, background: '#3b82f6', color: 'white', border: 'none',
                            borderRadius: 8, fontWeight: 'bold', cursor: 'pointer'
                        }}>
                            Find Matching Properties
                        </button>
                        <button style={{
                            flex: 1, padding: 15, background: 'white', color: '#3b82f6', border: '2px solid #3b82f6',
                            borderRadius: 8, fontWeight: 'bold', cursor: 'pointer'
                        }}
                            onClick={() => setShowDetails(!showDetails)}>
                            {showDetails ? 'Hide' : 'Show'} Detailed Breakdown
                        </button>
                    </div>

                    {showDetails && (
                        <div style={{ marginTop: 20, padding: 15, background: '#fef3c7', borderRadius: 8, fontSize: 13 }}>
                            <strong>📋 Detailed Calculation:</strong>
                            <ul style={{ marginTop: 10 }}>
                                <li>Monthly Surplus × 60 months = ₹50k × 60 = ₹30L</li>
                                <li>Liquid Assets (80% available) = ₹20L × 0.8 = ₹16L</li>
                                <li>Loan Eligibility (3.5× EMI capacity for 750+ score) = ₹50k × 3.5 × 60 = ₹105L</li>
                                <li><strong>Total Buying Power = ₹30L + ₹16L + ₹105L = ₹1.2Cr (upper bound)</strong></li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Privacy Notice */}
                <div style={{ marginTop: 30, padding: 15, background: '#e0f2fe', borderRadius: 8, fontSize: 13, color: '#0369a1' }}>
                    🔒 <strong>Privacy First:</strong> We never store your raw financial data. Only derived assertions (like "₹40k-60k surplus")
                    are saved with your consent. You can revoke access anytime from Settings.
                </div>
            </div>
        </div>
    );
}

function IntegrationCard({ title, status, icon, items, action }: any) {
    const statusColors: any = {
        'VERIFIED': '#22c55e',
        'EXCELLENT': '#22c55e',
        'LINKED': '#3b82f6',
        'WARNING': '#f59e0b',
        'PENDING': '#64748b'
    };

    return (
        <div style={{ background: 'white', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <div style={{ fontSize: 24 }}>{icon}</div>
                <div style={{
                    fontSize: 10, fontWeight: 'bold', padding: '4px 8px', borderRadius: 12,
                    background: statusColors[status] + '20', color: statusColors[status]
                }}>
                    {status}
                </div>
            </div>
            <h3 style={{ margin: '0 0 15px 0', fontSize: 16 }}>{title}</h3>
            {items.map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{item.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 'bold', color: item.color }}>{item.value}</span>
                </div>
            ))}
            {action && (
                <button onClick={action.onClick} style={{
                    marginTop: 15, width: '100%', padding: 10, background: '#f8fafc', border: '1px solid #e2e8f0',
                    borderRadius: 6, fontSize: 12, fontWeight: 'bold', cursor: 'pointer', color: '#475569'
                }}>
                    {action.label}
                </button>
            )}
        </div>
    );
}
