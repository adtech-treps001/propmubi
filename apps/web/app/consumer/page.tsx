"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
    id: string;
    name: string;
    developer: string;
    location: string;
    price_range: string;
    image: string;
    trust_score: number;
    type?: 'APARTMENT' | 'PLOT' | 'FARM';
}

// Fallback high-quality images for Demo if primary fails
const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800", // Modern
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800", // Luxury
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800", // High Rise
    "https://images.unsplash.com/photo-1600596542815-faad4c1539a9?auto=format&fit=crop&w=800"  // Villa
];

export default function ConsumerFeed() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Try fetching real data (mock or seed)
                const res = await fetch('http://localhost:8000/projects/feed');
                let data = await res.json();

                // DATA REPAIR STRATEGY: 
                // If images are broken/missing, inject high-res Unsplash images cyclically
                data = data.map((p: Project, i: number) => ({
                    ...p,
                    image: FALLBACK_IMAGES[i % FALLBACK_IMAGES.length] // Ensure valid image
                }));

                setProjects(data);
            } catch (e) {
                console.error("Failed to load feed", e);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) return <div style={styles.center}>Loading Feed...</div>;
    if (projects.length === 0) return <div style={styles.center}>No projects found.</div>;

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <span style={styles.badge}>PropMubi Trust Feed</span>
            </header>

            {/* Desktop Grid / Mobile List */}
            <div style={styles.grid}>
                {projects.map((project) => (
                    <div key={project.id} style={styles.card}>
                        <div style={styles.imageWrapper}>
                            <img
                                src={project.image}
                                alt={project.name}
                                style={styles.image}
                                onError={(e) => {
                                    // Ultra-safety: If even Unsplash fails, show placeholder
                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x600?text=PropMubi+Project";
                                }}
                            />

                            {/* Overlay Content */}
                            <div style={styles.overlay}>
                                <div style={styles.tags}>
                                    {project.type && (
                                        <span style={{
                                            ...styles.tagDev,
                                            background: project.type === 'FARM' ? '#8e44ad' : project.type === 'PLOT' ? '#e67e22' : '#3498db'
                                        }}>
                                            {project.type === 'FARM' ? '🌾 Managed Farm' : project.type === 'PLOT' ? '📐 Open Plot' : '🏢 Apartment'}
                                        </span>
                                    )}
                                    <span style={styles.tagDev}>{project.developer}</span>
                                    <span style={{
                                        ...styles.tagScore,
                                        background: project.trust_score > 90 ? '#2ecc71' : '#f1c40f'
                                    }}>
                                        🛡️ {project.trust_score}% Trust
                                    </span>
                                </div>

                                <h2 style={styles.title}>{project.name}</h2>
                                <p style={styles.location}>📍 {project.location}</p>
                                <h3 style={styles.price}>{project.price_range}</h3>

                                <div style={styles.ctaGrid}>
                                    <Link href={`/projects/${project.id}`} style={styles.link}>
                                        <button style={styles.btnSecondary}>View Details</button>
                                    </Link>
                                    <button style={styles.btnPrimary}>Book Visit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 🎨 COMPONENT STYLES
const styles: any = {
    container: {
        width: '100%',
        minHeight: '100vh',
        background: '#000',
        paddingTop: 60, // Space for header
    },
    center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'black',
        color: 'white'
    },
    header: {
        position: 'fixed',
        top: 20,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none'
    },
    badge: {
        background: 'rgba(255,255,255,0.1)',
        color: 'white',
        padding: '8px 20px',
        borderRadius: 30,
        fontSize: 14,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        fontWeight: 'bold'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', // Responsive Grid
        gap: 20,
        padding: 20,
        maxWidth: 1400,
        margin: '0 auto'
    },
    card: {
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        background: '#1a1a1a',
        height: 600, // Fixed height for uniformity
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    },
    imageWrapper: {
        width: '100%',
        height: '100%',
        position: 'relative'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.5s'
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 25,
        background: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.9) 60%, transparent 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
    tags: {
        display: 'flex',
        gap: 10,
        marginBottom: 10
    },
    tagDev: {
        background: 'rgba(255,255,255,0.2)',
        color: 'white',
        padding: '4px 10px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600
    },
    tagScore: {
        color: 'white',
        padding: '4px 10px',
        borderRadius: 6,
        fontWeight: 'bold',
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 4
    },
    title: {
        color: 'white',
        margin: 0,
        fontSize: 28,
        fontWeight: 800,
        textShadow: '0 2px 10px rgba(0,0,0,0.5)'
    },
    location: {
        color: '#ccc',
        fontSize: 14,
        marginTop: 5
    },
    price: {
        color: '#f1c40f',
        margin: '10px 0 20px 0',
        fontSize: 22,
        fontWeight: 700
    },
    ctaGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
    },
    link: {
        width: '100%',
        textDecoration: 'none'
    },
    btnSecondary: {
        width: '100%',
        padding: 12,
        background: 'rgba(255,255,255,0.1)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: 10,
        fontWeight: 'bold',
        cursor: 'pointer',
        backdropFilter: 'blur(5px)'
    },
    btnPrimary: {
        width: '100%',
        padding: 12,
        background: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: 10,
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)'
    }
};
