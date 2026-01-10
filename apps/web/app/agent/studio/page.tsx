"use client";
import React, { useState } from 'react';

export default function AgentStudio() {
    const [generating, setGenerating] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            setGeneratedUrl("https://media.giphy.com/media/l41lFw057lAJcYDsY/giphy.gif"); // Placeholder generated content
        }, 3000);
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 40 }}>
            <h1 style={{ fontSize: 32, marginBottom: 10 }}>🎬 Agent Content Studio</h1>
            <p style={{ color: '#666', marginBottom: 40 }}>Turn your verified listings into viral Instagram Reels using PropMubi AI.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 40 }}>
                {/* Controls */}
                <div style={{ background: 'white', padding: 30, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginBottom: 20 }}>1. Select Listing</h3>
                    <select style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', marginBottom: 20 }}>
                        <option>My Home Sayuk (Verified)</option>
                        <option>Aparna Zenon (Verified)</option>
                    </select>

                    <h3 style={{ marginBottom: 20 }}>2. Choose Vibe</h3>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
                        {['Luxury', 'Trendy', 'Minimal'].map(vibe => (
                            <button key={vibe} style={{
                                padding: '10px 20px',
                                borderRadius: 20,
                                border: '1px solid #ddd',
                                background: 'white',
                                cursor: 'pointer'
                            }}>{vibe}</button>
                        ))}
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        style={{
                            width: '100%',
                            padding: 15,
                            background: generating ? '#95a5a6' : '#2c3e50',
                            color: 'white',
                            border: 'none',
                            borderRadius: 8,
                            fontWeight: 'bold',
                            fontSize: 16
                        }}
                    >
                        {generating ? "✨ AI is Generating..." : "Generate Reel"}
                    </button>

                    {generatedUrl && (
                        <div style={{ marginTop: 20, padding: 15, background: '#e8f8f5', borderRadius: 8, color: '#27ae60' }}>
                            ✅ Reel Generated! Ready to share.
                        </div>
                    )}
                </div>

                {/* Preview */}
                <div style={{
                    background: '#000',
                    borderRadius: 20,
                    height: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {!generatedUrl ? (
                        <div style={{ color: '#555', textAlign: 'center' }}>
                            <div style={{ fontSize: 40, marginBottom: 20 }}>📱</div>
                            Preview Area
                        </div>
                    ) : (
                        <img src={generatedUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}

                    {/* Simulated Phone Frame */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 20, display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                        <span>9:41</span>
                        <span>📶 🔋</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
