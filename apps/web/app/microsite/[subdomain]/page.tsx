"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function AgentMicrosite() {
    const params = useParams();
    const subdomain = params?.subdomain as string;
    const [config, setConfig] = useState<any>(null);
    const [listings, setListings] = useState<any[]>([]);

    useEffect(() => {
        // Fetch microsite config
        const fetchMicrosite = async () => {
            try {
                // Mock: In production, this would fetch from /agent/microsites/{subdomain}
                setConfig({
                    agent_name: "Ramesh Kumar",
                    tagline: "Your Trusted Real Estate Advisor - Financial District",
                    theme: "professional",
                    contact: "+91 98765 43210"
                });

                // Fetch agent's verified listings
                const res = await fetch(`http://localhost:8000/agent/listings`);
                const data = await res.json();
                setListings(data.filter((l: any) => l.status === 'VERIFIED'));
            } catch (e) {
                console.error("Failed to load microsite", e);
            }
        };
        fetchMicrosite();
    }, [subdomain]);

    if (!config) return <div style={{ padding: 40 }}>Loading...</div>;

    return (
        <div style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', padding: '60px 20px' }}>
            <div style={{ maxWidth: 900, margin: '0 auto', background: 'white', borderRadius: 16, padding: 40, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                {/* Hero */}
                <div style={{ textAlign: 'center', marginBottom: 50 }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#3498db', color: 'white', fontSize: 32, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        {config.agent_name[0]}
                    </div>
                    <h1 style={{ fontSize: 36, margin: 0, color: '#2c3e50' }}>{config.agent_name}</h1>
                    <p style={{ color: '#7f8c8d', fontSize: 16, marginTop: 8 }}>{config.tagline}</p>
                    <div style={{ marginTop: 20 }}>
                        <span style={{ display: 'inline-block', padding: '10px 20px', background: '#2ecc71', color: 'white', borderRadius: 30, fontWeight: 'bold', fontSize: 14 }}>
                            ✓ PropMubi Verified Agent
                        </span>
                    </div>
                </div>

                {/* Listings */}
                <div>
                    <h2 style={{ fontSize: 24, marginBottom: 30, color: '#2c3e50' }}>Curated Off-Market Properties</h2>
                    <div style={{ display: 'grid', gap: 20 }}>
                        {listings.length === 0 && (
                            <div style={{ textAlign: 'center', padding: 40, color: '#7f8c8d' }}>
                                No verified listings yet. Check back soon!
                            </div>
                        )}
                        {listings.map((listing: any) => (
                            <div key={listing.id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 24, background: '#f8f9fa' }}>
                                <h3 style={{ fontSize: 20, margin: 0, color: '#2c3e50' }}>{listing.property_details.property_name}</h3>
                                <div style={{ color: '#3498db', fontWeight: 'bold', fontSize: 18, marginTop: 8 }}>
                                    ₹ {listing.property_details.price.toLocaleString()}
                                </div>
                                <p style={{ color: '#7f8c8d', fontSize: 14, marginTop: 10 }}>{listing.property_details.description}</p>
                                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                                    <button style={{ flex: 1, padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>
                                        Request Details
                                    </button>
                                    <button style={{ flex: 1, padding: '12px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>
                                        Site Visit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact CTA */}
                <div style={{ marginTop: 50, textAlign: 'center', padding: 30, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 12 }}>
                    <h3 style={{ color: 'white', margin: 0 }}>Ready to find your dream property?</h3>
                    <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: 8 }}>Contact me directly via WhatsApp</p>
                    <a href={`https://wa.me/${config.contact.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer">
                        <button style={{ marginTop: 20, padding: '15px 40px', background: '#25d366', color: 'white', border: 'none', borderRadius: 30, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}>
                            WhatsApp Me
                        </button>
                    </a>
                </div>
            </div>

            {/* Trust Badge */}
            <div style={{ textAlign: 'center', marginTop: 30, color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                Powered by <strong>PropMubi Trust OS</strong> · All listings verified
            </div>
        </div>
    );
}
