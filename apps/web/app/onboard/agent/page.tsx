"use client";

import React, { useState } from 'react';

export default function AgentOnboarding() {
    const [status, setStatus] = useState<'IDLE' | 'ANALYZING' | 'SUCCESS'>('IDLE');
    const [logs, setLogs] = useState<string[]>([]);
    const [data, setData] = useState<any>(null);

    const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    const handleUpload = (e: any) => {
        setStatus('ANALYZING');
        addLog("Scanning Visiting Card / RERA Card...");
        setTimeout(() => {
            addLog("Extracting Name & Contact...");
            addLog("Identifying Brokerage Firm...");
            addLog("Calculating Market Reputation...");
            setTimeout(() => {
                setStatus('SUCCESS');
                setData({
                    name: "Rahul Sharma",
                    role: "Channel Partner",
                    firm: "SquareYards",
                    rating: 4.5,
                    verified: true
                });
            }, 2000);
        }, 1500);
    };

    return (
        <div style={{ padding: 40, background: '#f5f6fa', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', padding: 40, borderRadius: 16 }}>
                <h1>🤝 Agent Onboarding</h1>
                <p style={{ color: '#7f8c8d' }}>Upload your Visiting Card to join the network.</p>

                {status === 'IDLE' && (
                    <div style={{ border: '2px dashed #ddd', padding: 40, textAlign: 'center', borderRadius: 12, cursor: 'pointer', marginTop: 30 }}>
                        <div style={{ fontSize: 40 }}>🪪</div>
                        <input type="file" onChange={handleUpload} style={{ display: 'none' }} id="file" />
                        <label htmlFor="file" style={{ cursor: 'pointer', color: '#3498db', fontWeight: 'bold' }}>Click to Upload Card</label>
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
                            <h3>Agent Verified</h3>
                        </div>

                        <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                <span>Name</span>
                                <strong>{data.name}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                <span>Firm</span>
                                <strong>{data.firm}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                <span>Initial Rating</span>
                                <strong>⭐ {data.rating}</strong>
                            </div>
                        </div>

                        <button onClick={() => window.location.href = '/agent'} style={{ width: '100%', padding: 15, background: '#27ae60', color: 'white', border: 'none', borderRadius: 8, marginTop: 20, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}>
                            Go to Agent CRM
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
