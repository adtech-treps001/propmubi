"use client";

import React, { useState } from 'react';

// Mock legal document graph
const LEGAL_DOCS = [
    { id: 'title', name: 'Land Title Deed', status: 'VERIFIED', date: '2020-05-12', children: ['sale', 'ec'] },
    { id: 'sale', name: 'Sale Deed (Seller → Builder)', status: 'VERIFIED', date: '2020-06-01', children: [] },
    { id: 'ec', name: 'Encumbrance Certificate', status: 'VERIFIED', date: '2023-11-15', children: [] },
    { id: 'conversion', name: 'Land Conversion (Agri → Non-Agri)', status: 'VERIFIED', date: '2019-03-10', children: [] },
    { id: 'layout', name: 'Layout Approval (DTCP)', status: 'VERIFIED', date: '2020-01-20', children: [] },
    { id: 'rera', name: 'RERA Certificate', status: 'VERIFIED', date: '2021-02-01', children: ['builder_pan', 'architect', 'timeline'] },
    { id: 'builder_pan', name: 'Builder PAN Card', status: 'VERIFIED', date: '2020-12-01', children: [] },
    { id: 'architect', name: 'Architect License', status: 'VERIFIED', date: '2020-11-15', children: [] },
    { id: 'timeline', name: 'Completion Timeline', status: 'PENDING', date: '-', children: [] },
    { id: 'noc_fire', name: 'NOC - Fire Department', status: 'PENDING', date: '-', children: [] },
    { id: 'occupancy', name: 'Occupancy Certificate', status: 'PENDING', date: '-', children: [] }
];

export default function LegalMindMapPage({ params }: { params: { id: string } }) {
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'TREE' | 'LIST'>('TREE');

    // Calculate score
    const verifiedCount = LEGAL_DOCS.filter(d => d.status === 'VERIFIED').length;
    const totalCount = LEGAL_DOCS.length;
    const legalScore = Math.round((verifiedCount / totalCount) * 100);

    return (
        <div style={{ padding: 40, background: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                    <div>
                        <h1 style={{ fontSize: 32, margin: 0 }}>⚖️ Legal Document Chain</h1>
                        <p style={{ color: '#94a3b8', marginTop: 5 }}>Project ID: {params.id} - My Home Sayuk</p>
                    </div>
                    <div style={{ background: legalScore > 70 ? '#22c55e' : '#f59e0b', padding: '10px 20px', borderRadius: 12 }}>
                        <div style={{ fontSize: 12, opacity: 0.9 }}>LEGAL SCORE</div>
                        <div style={{ fontSize: 32, fontWeight: 'bold' }}>{legalScore}/100</div>
                    </div>
                </div>

                {/* View Mode Toggle */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    <button
                        onClick={() => setViewMode('TREE')}
                        style={{
                            padding: '10px 20px', borderRadius: 8, border: 'none', fontWeight: 'bold',
                            background: viewMode === 'TREE' ? '#3b82f6' : '#1e293b', color: 'white', cursor: 'pointer'
                        }}>
                        🌳 Tree View
                    </button>
                    <button
                        onClick={() => setViewMode('LIST')}
                        style={{
                            padding: '10px 20px', borderRadius: 8, border: 'none', fontWeight: 'bold',
                            background: viewMode === 'LIST' ? '#3b82f6' : '#1e293b', color: 'white', cursor: 'pointer'
                        }}>
                        📋 List View
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 20 }}>

                    {/* Left: Document Graph */}
                    <div style={{ background: '#1e293b', padding: 30, borderRadius: 16 }}>
                        {viewMode === 'TREE' ? (
                            <div>
                                <h3 style={{ marginTop: 0, color: '#94a3b8', fontSize: 14 }}>DOCUMENT DEPENDENCY TREE</h3>
                                {renderTree('title', 0)}
                            </div>
                        ) : (
                            <div>
                                <h3 style={{ marginTop: 0, color: '#94a3b8', fontSize: 14 }}>ALL DOCUMENTS (CHRONOLOGICAL)</h3>
                                {LEGAL_DOCS.sort((a, b) => a.date.localeCompare(b.date)).map(doc => (
                                    <div
                                        key={doc.id}
                                        onClick={() => setSelectedDoc(doc)}
                                        style={{
                                            padding: 15, marginBottom: 10, background: '#0f172a', borderRadius: 8,
                                            cursor: 'pointer', border: selectedDoc?.id === doc.id ? '2px solid #3b82f6' : 'none'
                                        }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{doc.name}</div>
                                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>
                                                    Date: {doc.date === '-' ? 'Awaited' : doc.date}
                                                </div>
                                            </div>
                                            <StatusBadge status={doc.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Document Details */}
                    <div style={{ background: '#1e293b', padding: 30, borderRadius: 16 }}>
                        <h3 style={{ marginTop: 0, color: '#94a3b8', fontSize: 14 }}>DOCUMENT DETAILS</h3>
                        {selectedDoc ? (
                            <div>
                                <h2 style={{ fontSize: 20, marginTop: 0 }}>{selectedDoc.name}</h2>
                                <div style={{ marginTop: 20 }}>
                                    <DetailRow label="Status" value={selectedDoc.status} valueColor={selectedDoc.status === 'VERIFIED' ? '#22c55e' : '#f59e0b'} />
                                    <DetailRow label="Date" value={selectedDoc.date} />
                                    <DetailRow label="Source" value="Sub-Registrar Office" />
                                    <DetailRow label="Document ID" value={`DOC-${selectedDoc.id.toUpperCase()}-2024`} />
                                </div>

                                {selectedDoc.status === 'VERIFIED' && (
                                    <div style={{ marginTop: 20, padding: 15, background: '#22c55e20', borderRadius: 8, border: '1px solid #22c55e' }}>
                                        <div style={{ color: '#22c55e', fontWeight: 'bold', marginBottom: 5 }}>✅ Verification Details</div>
                                        <div style={{ fontSize: 13, color: '#94a3b8' }}>
                                            Verified by PropMubi Legal Team on {selectedDoc.date}. Document hash matches official records.
                                        </div>
                                    </div>
                                )}

                                {selectedDoc.status === 'PENDING' && (
                                    <div style={{ marginTop: 20, padding: 15, background: '#f59e0b20', borderRadius: 8, border: '1px solid #f59e0b' }}>
                                        <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: 5 }}>⏳ Pending</div>
                                        <div style={{ fontSize: 13, color: '#94a3b8' }}>
                                            This document is expected {selectedDoc.id === 'occupancy' ? 'upon project completion' : 'within 30 days'}.
                                        </div>
                                    </div>
                                )}

                                <button style={{
                                    marginTop: 20, width: '100%', padding: 15, background: '#3b82f6', border: 'none',
                                    borderRadius: 8, color: 'white', fontWeight: 'bold', cursor: 'pointer'
                                }}>
                                    📄 View Original Document
                                </button>

                                <button style={{
                                    marginTop: 10, width: '100%', padding: 15, background: '#1e293b', border: '1px solid #475569',
                                    borderRadius: 8, color: 'white', fontWeight: 'bold', cursor: 'pointer'
                                }}>
                                    💬 Ask Legal AI
                                </button>
                            </div>
                        ) : (
                            <div style={{ paddingTop: 60, textAlign: 'center', color: '#64748b' }}>
                                Click on any document to view details
                            </div>
                        )}
                    </div>
                </div>

                {/* Legal RAG Preview */}
                <div style={{ marginTop: 30, background: '#1e293b', padding: 30, borderRadius: 16 }}>
                    <h3 style={{ marginTop: 0 }}>💬 Ask Our Legal AI</h3>
                    <input
                        type="text"
                        placeholder="e.g., Is the Encumbrance Certificate clear?"
                        style={{
                            width: '100%', padding: 15, borderRadius: 8, border: '1px solid #475569',
                            background: '#0f172a', color: 'white', fontSize: 14
                        }}
                    />
                    <div style={{ marginTop: 15, padding: 15, background: '#0f172a', borderRadius: 8, fontSize: 13, color: '#94a3b8' }}>
                        <strong style={{ color: 'white' }}>Example Response:</strong> "Yes, the Encumbrance Certificate dated 2023-11-15 shows no mortgages or liens for the last 13 years.
                        Source: <a href="#" style={{ color: '#3b82f6' }}>[EC_2023_11_15.pdf]</a>"
                    </div>
                </div>
            </div>
        </div>
    );

    function renderTree(docId: string, depth: number): any {
        const doc = LEGAL_DOCS.find(d => d.id === docId);
        if (!doc) return null;

        return (
            <div style={{ marginLeft: depth * 30, marginBottom: 10 }}>
                <div
                    onClick={() => setSelectedDoc(doc)}
                    style={{
                        padding: 12, background: selectedDoc?.id === docId ? '#3b82f6' : '#0f172a',
                        borderRadius: 8, cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', border: selectedDoc?.id === docId ? '2px solid #60a5fa' : 'none'
                    }}>
                    <div>
                        <span style={{ marginRight: 10 }}>{depth === 0 ? '📄' : '├─'}</span>
                        <span style={{ fontWeight: depth === 0 ? 'bold' : 'normal' }}>{doc.name}</span>
                    </div>
                    <StatusBadge status={doc.status} />
                </div>
                {doc.children.map(childId => renderTree(childId, depth + 1))}
            </div>
        );
    }
}

function StatusBadge({ status }: { status: string }) {
    const colors: any = {
        'VERIFIED': { bg: '#22c55e20', text: '#22c55e' },
        'PENDING': { bg: '#f59e0b20', text: '#f59e0b' },
        'MISSING': { bg: '#ef444420', text: '#ef4444' }
    };
    const c = colors[status] || colors['PENDING'];

    return (
        <div style={{ padding: '4px 10px', borderRadius: 12, background: c.bg, color: c.text, fontSize: 11, fontWeight: 'bold' }}>
            {status}
        </div>
    );
}

function DetailRow({ label, value, valueColor }: { label: string, value: string, valueColor?: string }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #334155' }}>
            <span style={{ color: '#94a3b8', fontSize: 13 }}>{label}</span>
            <span style={{ fontWeight: 'bold', fontSize: 13, color: valueColor || 'white' }}>{value}</span>
        </div>
    );
}
