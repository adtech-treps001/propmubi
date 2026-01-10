"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function OnboardingHub() {
    return (
        <div style={{ minHeight: '100vh', padding: 40, background: '#f5f6fa', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: 36, marginBottom: 10, background: 'linear-gradient(90deg, #2c3e50, #4ca1af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    PropMubi Trust Network
                </h1>
                <p style={{ color: '#7f8c8d', fontSize: 18, marginBottom: 50 }}>
                    Select your role to begin the verified onboarding process.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30 }}>

                    <RoleCard
                        title="List a Project"
                        icon="🏗️"
                        desc="For Landowners & Logicstics. List unverified or open market projects for review."
                        link="/onboard/project"
                        color="#3498db"
                    />

                    <RoleCard
                        title="Join as Builder"
                        icon="🏢"
                        desc="For Developers. Verification required via RERA certificates and past track record."
                        link="/onboard/builder"
                        color="#e67e22"
                    />

                    <RoleCard
                        title="Join as Agent"
                        icon="🤝"
                        desc="For Channel Partners. Network with verified builders and access premium leads."
                        link="/onboard/agent"
                        color="#27ae60"
                        bg="#f0fdf4"
                    />

                </div>
            </div>
        </div>
    );
}

function RoleCard({ title, icon, desc, link, color, bg = 'white' }: any) {
    return (
        <Link href={link} style={{ textDecoration: 'none' }}>
            <div style={{
                background: bg,
                borderRadius: 16,
                padding: 40,
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                border: '1px solid transparent',
                transition: 'transform 0.2s, box-shadow 0.2s',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer'
            }}>
                <div style={{ fontSize: 60, marginBottom: 20 }}>{icon}</div>
                <h2 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>{title}</h2>
                <p style={{ color: '#7f8c8d', fontSize: 14, lineHeight: 1.6, flex: 1 }}>{desc}</p>

                <div style={{
                    marginTop: 20,
                    padding: '10px 20px',
                    borderRadius: 30,
                    background: `${color}20`,
                    color: color,
                    fontWeight: 'bold',
                    fontSize: 14
                }}>
                    Start Onboarding →
                </div>
            </div>
        </Link>
    );
}
