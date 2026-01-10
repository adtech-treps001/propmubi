"use client";

import React, { useState } from 'react';

export default function BuilderOnboarding() {
    const [status, setStatus] = useState<'IDLE' | 'ANALYZING' | 'SUCCESS'>('IDLE');
    const [logs, setLogs] = useState<string[]>([]);
    const [data, setData] = useState<any>(null);

    const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    const handleUpload = (e: any) => {
        setStatus('ANALYZING');
        addLog("Uploading Company Profile...");
        setTimeout(() => {
            addLog("Extracting RERA ID...");
            addLog("Analyzing Past Projects (5 detected)...");
            addLog("Verifying Financial Health...");
            setTimeout(() => {
                setStatus('SUCCESS');
                setData({
                    name: "Prestige Group",
                    rera: "P024000123",
                    rating: 4.8,
                    projects: 5,
                    trust_score: 92
                });
            }, 2000);
        }, 1500);
    };

    return (
        <div style={{ padding: 40, background: '#f5f6fa', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', padding: 40, borderRadius: 16 }}>
                <h1>🏗️ Builder Onboarding</h1>
                <p style={{ color: '#7f8c8d' }}>Upload your Company Profile or RERA Certificate to auto-fill details.</p>

                {status === 'IDLE' && (
                    <div style={{ border: '2px dashed #ddd', padding: 40, textAlign: 'center', borderRadius: 12, cursor: 'pointer', marginTop: 30 }}>
                        <div style={{ fontSize: 40 }}>📄</div>
                        <input type="file" onChange={handleUpload} style={{ display: 'none' }} id="file" />
                        <label htmlFor="file" style={{ cursor: 'pointer', color: '#3498db', fontWeight: 'bold' }}>Click to Upload</label>
                    </div>
                )}

                {status === 'ANALYZING' && (
                    <div style={{ marginTop: 30, background: '#2c3e50', color: '#2ecc71', padding: 20, borderRadius: 8, fontFamily: 'monospace', fontSize: 12 }}>
                        {logs.map((L, i) => <div key={i}>{L}</div>)}
                    </div>
                )}

                {status === 'SUCCESS' && (
                    <div style={{ marginTop: 30 }}>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: 50 }}>✅</div>
                            <h3>Verification Successful</h3>
                        </div>

                        <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                <span>Company Name</span>
                                <strong>{data.name}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                <span>RERA ID</span>
                                <strong>{data.rera}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                <span>Initial Trust Score</span>
                                <strong style={{ color: '#27ae60' }}>{data.trust_score}/100</strong>
                            </div>
                        </div>

                        <button onClick={() => window.location.href = '/builder'} style={{ width: '100%', padding: 15, background: '#27ae60', color: 'white', border: 'none', borderRadius: 8, marginTop: 20, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}>
                            Go to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
