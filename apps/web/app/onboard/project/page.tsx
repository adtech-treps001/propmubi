"use client";

import React, { useState } from 'react';

export default function ProjectOnboarding() {
    return (
        <div style={{ padding: 40, background: '#f5f6fa', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', background: 'white', padding: 40, borderRadius: 16 }}>
                <h1>🏗️ List Open Market Project</h1>
                <p style={{ color: '#7f8c8d' }}>Submit project details. Our AI will verify against land records.</p>

                <form style={{ marginTop: 30, display: 'grid', gap: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <input placeholder="Project Name" style={inputStyle} />
                        <input placeholder="Developer / Landowner Name" style={inputStyle} />
                    </div>

                    <input placeholder="Location / Survey Number" style={inputStyle} />
                    <textarea placeholder="Description & Amenities" style={{ ...inputStyle, height: 100 }} />

                    <div style={{ border: '2px dashed #ddd', padding: 30, textAlign: 'center', borderRadius: 8, color: '#999' }}>
                        Drag & Drop Brochure / Site Photos
                    </div>

                    <button type="button" onClick={() => alert('Project Submitted for AI Verification!')} style={{ padding: 15, background: '#3498db', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}>
                        Submit for Verification
                    </button>
                </form>
            </div>
        </div>
    );
}

const inputStyle = {
    padding: 15, border: '1px solid #ddd', borderRadius: 8, fontSize: 14
};
