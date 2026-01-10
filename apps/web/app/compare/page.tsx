"use client";

import React from 'react';
import { usePersona } from '../context/PersonaContext';

// Mock Data for Comparison
const PROJECTS = [
    {
        id: "101",
        name: "My Home Sayuk",
        price: "1.2 Cr",
        yield: 4.2, // % Rental Yield
        appreciation: 8.5, // % Annual
        livability: 9.2, // Score / 10
        connectivity: 8.0,
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400"
    },
    {
        id: "102",
        name: "Aparna Zenon",
        price: "1.0 Cr",
        yield: 5.1, // Higher Yield
        appreciation: 9.0,
        livability: 7.5, // Lower Livability
        connectivity: 7.8,
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400"
    }
];

export default function ComparePage() {
    const { persona } = usePersona();

    // Calculate Scores based on Persona Weights
    const calculateScore = (project: any) => {
        if (persona === 'INVESTOR') {
            // ROI heavy
            return (project.yield * 10) + (project.appreciation * 5);
        } else if (persona === 'FAMILY') {
            // Livability heavy
            return (project.livability * 10) + (project.connectivity * 2);
        } else {
            // NRI: Balanced + Brand
            return (project.yield * 5) + (project.livability * 5) + 20; // +20 for Brand safety
        }
    };

    const p1Score = calculateScore(PROJECTS[0]);
    const p2Score = calculateScore(PROJECTS[1]);
    const winnerId = p1Score > p2Score ? PROJECTS[0].id : PROJECTS[1].id;

    return (
        <div style={{ padding: 40, background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <h1 style={{ fontSize: 32, marginBottom: 10 }}>Persona-Based Comparison Engine</h1>
                <p style={{ color: '#64748b' }}>
                    Analyzing for: <strong style={{ color: '#3b82f6' }}>{persona}</strong> context.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
                {PROJECTS.map(p => {
                    const isWinner = p.id === winnerId;
                    const score = calculateScore(p);

                    return (
                        <div key={p.id} style={{
                            background: 'white',
                            borderRadius: 16,
                            padding: 20,
                            border: isWinner ? '3px solid #22c55e' : '1px solid #e2e8f0',
                            position: 'relative',
                            transition: 'all 0.3s'
                        }}>
                            {isWinner && (
                                <div style={{
                                    position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)',
                                    background: '#22c55e', color: 'white', padding: '5px 15px', borderRadius: 20, fontWeight: 'bold'
                                }}>
                                    🏆 BEST CHOICE FOR YOU
                                </div>
                            )}

                            <img src={p.image} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }} />

                            <h2 style={{ marginTop: 15 }}>{p.name}</h2>
                            <h3 style={{ color: '#f59e0b' }}>{p.price}</h3>

                            <div style={{ marginTop: 20 }}>
                                <MetricRow label="Rental Yield" value={`${p.yield}%`} highlight={persona === 'INVESTOR'} />
                                <MetricRow label="Appreciation" value={`${p.appreciation}%`} highlight={persona === 'INVESTOR'} />
                                <MetricRow label="Livability Score" value={`${p.livability}/10`} highlight={persona === 'FAMILY'} />
                                <MetricRow label="Connectivity" value={`${p.connectivity}/10`} highlight={persona === 'FAMILY'} />
                            </div>

                            <div style={{ marginTop: 30, textAlign: 'center' }}>
                                <div style={{ fontSize: 12, color: '#94a3b8' }}>AI MATCH SCORE</div>
                                <div style={{ fontSize: 40, fontWeight: 'bold', color: isWinner ? '#22c55e' : '#94a3b8' }}>
                                    {score.toFixed(1)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ maxWidth: 600, margin: '40px auto', padding: 20, background: '#e0f2fe', borderRadius: 12, color: '#0369a1', fontSize: 13 }}>
                ℹ️ <strong>Why this result?</strong> Based on your <strong>{persona}</strong> profile, we weighted
                {persona === 'INVESTOR' ? ' Financial Yields (80%)' : ' Livability & Safety (80%)'} higher than other factors.
            </div>
        </div>
    );
}

function MetricRow({ label, value, highlight }: { label: string, value: string, highlight: boolean }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ color: highlight ? '#3b82f6' : '#64748b', fontWeight: highlight ? 'bold' : 'normal' }}>
                {label} {highlight && '★'}
            </span>
            <span style={{ fontWeight: 'bold' }}>{value}</span>
        </div>
    );
}
