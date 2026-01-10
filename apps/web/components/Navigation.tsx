"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { usePersona, PersonaType } from '../app/context/PersonaContext';

export default function Navigation() {
    const pathname = usePathname();
    // Wrap hook call in a try/catch or ensure it's provided. 
    // Since Navigation is inside Providers (layout.tsx), this is safe.
    // However, if SSR fails context, we might need a safeguard. 
    // Ideally user shouldn't see nav on failure.

    // NOTE: 'useContext' in a Client Component that is rendered on server (SSR) BEFORE hydration might throw if provider isn't up. 
    // But in Next.js 13+, wrapping layout.tsx in Providers usually works. 
    // Let's assume standard behavior.

    const { persona, setPersona } = usePersona();

    // Don't show nav on microsite pages
    if (pathname?.startsWith('/microsite')) {
        return null;
    }

    const links = [
        { href: '/builder', label: 'Builder Dashboard', icon: '🏗️' },
        { href: '/agent', label: 'Agent CRM', icon: '🤝' },
        { href: '/consumer', label: 'Consumer View', icon: '🏠' },
        { href: '/profile/properties', label: 'My Assets', icon: '💼' },
        { href: '/onboard', label: 'Magic Onboard', icon: '✨' },
        { href: '/microsite/demo', label: 'Sample Microsite', icon: '🌐' },
    ];

    return (
        <nav style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '0 40px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 40,
                maxWidth: 1400,
                margin: '0 auto'
            }}>
                {/* Logo */}
                <Link href="/builder" style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '20px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                }}>
                    <span>🏢</span>
                    <span>PropMubi</span>
                    <span style={{ fontSize: 12, opacity: 0.8, marginLeft: 8 }}>Trust OS</span>
                </Link>

                {/* Navigation Links */}
                <div style={{ display: 'flex', gap: 0, flex: 1 }}>
                    {links.map(link => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                    padding: '20px 24px',
                                    borderBottom: isActive ? '4px solid white' : '4px solid transparent',
                                    transition: 'all 0.2s',
                                    fontSize: 14,
                                    fontWeight: 500,
                                    opacity: isActive ? 1 : 0.8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8
                                }}
                            >
                                <span>{link.icon}</span>
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Persona Switcher */}
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderRadius: 20, padding: 4, marginRight: 20 }}>
                    {(['FAMILY', 'INVESTOR', 'NRI'] as PersonaType[]).map(p => (
                        <button
                            key={p}
                            onClick={() => setPersona(p)}
                            style={{
                                background: persona === p ? 'white' : 'transparent',
                                color: persona === p ? '#667eea' : 'white',
                                border: 'none',
                                borderRadius: 16,
                                padding: '6px 12px',
                                fontSize: 12,
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                {/* User Menu */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    color: 'white'
                }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                    }}>
                        AB
                    </div>
                    <span style={{ fontSize: 14 }}>Admin</span>
                </div>
            </div>
        </nav>
    );
}
