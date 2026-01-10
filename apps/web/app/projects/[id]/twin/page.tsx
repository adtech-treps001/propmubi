"use client";

import React, { useState, useEffect } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import dynamic from 'next/dynamic';

// --- ICONS ---
const Icons = {
    Sun: () => <span>☀️</span>,
    Wind: () => <span>💨</span>,
    Vastu: () => <span>🕉️</span>,
    Furniture: () => <span>🪑</span>,
    Back: () => <span>⬅️</span>
};

// --- MOCK DATA ---
const TOWER_CONFIG = {
    floors: 35,
    unitsPerFloor: 8,
    unitTypes: ['3BHK East', '3BHK West', '2BHK North']
};

export default function DigitalTwinPage({ params }: { params: { id: string } }) {
    const [viewLevel, setViewLevel] = useState<'SITE' | 'TOWER' | 'UNIT'>('SITE');
    const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(12); // 12 PM
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', background: '#0f172a', color: 'white' }}>
            {/* Header / Nav */}
            <div style={{ height: 60, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', background: '#1e293b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    {viewLevel !== 'SITE' && (
                        <button onClick={() => setViewLevel(prev => prev === 'UNIT' ? 'TOWER' : 'SITE')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 20 }}>
                            <Icons.Back />
                        </button>
                    )}
                    <h2 style={{ margin: 0, fontSize: 18 }}>
                        {viewLevel === 'SITE' && `Project Site Map`}
                        {viewLevel === 'TOWER' && `Tower 4 Structure`}
                        {viewLevel === 'UNIT' && `Unit ${selectedUnit} Interior Twin`}
                    </h2>
                </div>

                {/* Global Time Control */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12 }}>Time: {currentTime}:00</span>
                    <input
                        type="range" min="6" max="18" value={currentTime}
                        onChange={e => setCurrentTime(parseInt(e.target.value))}
                        style={{ width: 150 }}
                    />
                    <Icons.Sun />
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* VIEW LEVEL 1: SITE MAP */}
                {viewLevel === 'SITE' && (
                    <div style={{ flex: 1, position: 'relative' }}>
                        <APIProvider apiKey={apiKey}>
                            <Map
                                defaultCenter={{ lat: 17.46, lng: 78.29 }}
                                defaultZoom={18}
                                mapTypeId={'satellite'}
                                disableDefaultUI={true}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </APIProvider>

                        {/* Interactive Tower Overlay */}
                        <div
                            onClick={() => setViewLevel('TOWER')}
                            style={{
                                position: 'absolute', top: '40%', left: '45%',
                                width: 80, height: 80, background: 'rgba(52, 152, 219, 0.4)',
                                border: '2px solid #3498db', borderRadius: 8, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backdropFilter: 'blur(4px)',
                                animation: 'pulse 2s infinite'
                            }}>
                            <span style={{ fontWeight: 'bold' }}>Tower 4</span>
                        </div>
                    </div>
                )}

                {/* VIEW LEVEL 2: TOWER STRUCTURE (Repeated Floors) */}
                {viewLevel === 'TOWER' && (
                    <TowerView onSelectUnit={(unit) => { setSelectedUnit(unit); setViewLevel('UNIT'); }} />
                )}

                {/* VIEW LEVEL 3: UNIT INTERIOR (Unit Twin) */}
                {viewLevel === 'UNIT' && (
                    <UnitInteriorDesigner unitId={selectedUnit} time={currentTime} />
                )}

            </div>

            <style jsx global>{`
                @keyframes pulse {
                    0% { transform: scale(1); border-color: rgba(52, 152, 219, 0.8); }
                    50% { transform: scale(1.05); border-color: rgba(52, 152, 219, 0.3); }
                    100% { transform: scale(1); border-color: rgba(52, 152, 219, 0.8); }
                }
            `}</style>
        </div>
    );
}

// --- COMPONENT: TOWER VIEW ---
function TowerView({ onSelectUnit }: { onSelectUnit: (u: string) => void }) {
    // Generate floors
    const floors = Array.from({ length: 15 }, (_, i) => 15 - i); // Just showing 15 floors for demo

    return (
        <div style={{ flex: 1, display: 'flex', background: '#0f172a', padding: 40, gap: 40 }}>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 20 }}>
                <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: 10 }}>Tower 4 Stack</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {floors.map(floor => (
                        <div key={floor} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <div style={{ width: 40, color: '#94a3b8', fontSize: 12 }}>Lvl {floor}</div>
                            <div style={{ display: 'flex', gap: 5, flex: 1 }}>
                                {[1, 2, 3, 4].map(u => (
                                    <div
                                        key={u}
                                        onClick={() => onSelectUnit(`${floor}0${u}`)}
                                        style={{
                                            flex: 1, height: 30, background: '#1e293b',
                                            borderRadius: 4, border: '1px solid #334155', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 11, color: '#bfdbfe',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = '#3b82f6')}
                                        onMouseLeave={e => (e.currentTarget.style.background = '#1e293b')}
                                    >
                                        Unit {floor}0{u}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ width: 300, background: '#1e293b', borderRadius: 16, padding: 20 }}>
                <h3>Structure Stats</h3>
                <p>Status: Structure Complete</p>
                <p>Completion: Dec 2025</p>
                <div style={{ height: 200, background: '#0f172a', borderRadius: 8, marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    [3D ISO VIEW]
                </div>
            </div>
        </div>
    );
}

// --- COMPONENT: UNIT INTERIOR DESIGNER ---
function UnitInteriorDesigner({ unitId, time }: { unitId: string | null, time: number }) {
    const [layers, setLayers] = useState({ vastu: false, wind: false, sun: true });
    const [furniture, setFurniture] = useState<{ id: number, type: string, x: number, y: number }[]>([]);

    const toggle = (l: keyof typeof layers) => setLayers(p => ({ ...p, [l]: !p[l] }));

    const handleDragStart = (e: React.DragEvent, type: string) => {
        e.dataTransfer.setData('type', type);
    };

    const handleDrop = (e: React.DragEvent) => {
        const type = e.dataTransfer.getData('type');
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setFurniture(p => [...p, { id: Date.now(), type, x, y }]);
    };

    // Derived Simulation Props
    const sunOpacity = (time - 6) / 12 * 0.5; // Simple Logic
    const sunAngle = (time - 6) * 15; // 0 to 180 deg

    return (
        <div style={{ flex: 1, display: 'flex' }}>
            {/* Sidebar Controls */}
            <div style={{ width: 250, background: '#1e293b', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Simulation Toggles */}
                <div>
                    <h4 style={{ color: '#94a3b8', marginBottom: 10 }}>SIMULATIONS</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <SimToggle label="☀️ Sunlight" active={layers.sun} onClick={() => toggle('sun')} />
                        <SimToggle label="💨 Ventilation" active={layers.wind} onClick={() => toggle('wind')} />
                        <SimToggle label="🕉️ Vastu Grid" active={layers.vastu} onClick={() => toggle('vastu')} />
                    </div>
                </div>

                {/* Furniture Palette */}
                <div>
                    <h4 style={{ color: '#94a3b8', marginBottom: 10 }}>DESIGN STUDIO</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <DraggableItem type="Bed" icon="🛏️" onDragStart={handleDragStart} />
                        <DraggableItem type="Sofa" icon="🛋️" onDragStart={handleDragStart} />
                        <DraggableItem type="Table" icon="🍽️" onDragStart={handleDragStart} />
                        <DraggableItem type="Plant" icon="🪴" onDragStart={handleDragStart} />
                    </div>
                </div>
            </div>

            {/* Canvas Area */}
            <div
                style={{ flex: 1, background: '#cbd5e1', position: 'relative', overflow: 'hidden' }}
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
            >
                {/* 1. FLOOR PLAN IMAGE (Background) */}
                <div style={{
                    width: '80%', height: '80%', margin: '5% auto',
                    background: 'white', border: '5px solid #475569', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    position: 'relative'
                }}>
                    {/* Mock Rooms Layout */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'grid', gridTemplateColumns: '1fr 1.5fr', gridTemplateRows: '1fr 1fr' }}>
                        <Room name="Master Bedroom" />
                        <Room name="Living Area" />
                        <Room name="Kitchen" />
                        <Room name="Guest Room" />
                    </div>

                    {/* 2. FURNITURE LAYER */}
                    {furniture.map(f => (
                        <div key={f.id} style={{ position: 'absolute', top: f.y - 20, left: f.x - 20, fontSize: 30, cursor: 'grab' }}>
                            {f.type === 'Bed' ? '🛏️' : f.type === 'Sofa' ? '🛋️' : '📦'}
                        </div>
                    ))}

                    {/* 3. SIMULATION LAYERS */}

                    {/* SUNLIGHT OVERLAY */}
                    {layers.sun && (
                        <div style={{
                            position: 'absolute', inset: 0, pointerEvents: 'none',
                            background: `linear-gradient(${sunAngle}deg, rgba(255, 166, 0, ${sunOpacity}), transparent 60%)`
                        }} />
                    )}

                    {/* VASTU GRID */}
                    {layers.vastu && (
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', opacity: 0.5 }}>
                            <div style={{ background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔥 Fire (SE)</div>
                            <div style={{ background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💧 Water (NE)</div>
                            <div style={{ background: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌍 Earth (SW)</div>
                            <div style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💨 Air (NW)</div>
                        </div>
                    )}

                    {/* WIND FLOW ANIMATION */}
                    {layers.wind && (
                        <div className="wind-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                            {/* Animated SVG Arrows */}
                            <svg width="100%" height="100%">
                                <defs>
                                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto">
                                        <path d="M0,0 L0,6 L9,3 z" fill="#60a5fa" />
                                    </marker>
                                </defs>
                                <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrow)">
                                    <animate attributeName="x1" from="-100" to="100%" dur="2s" repeatCount="indefinite" />
                                </line>
                                <line x1="0" y1="60%" x2="100%" y2="80%" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrow)">
                                    <animate attributeName="x1" from="-100" to="100%" dur="3s" repeatCount="indefinite" />
                                </line>
                            </svg>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

function SimToggle({ label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: 10, borderRadius: 8, border: '1px solid',
                borderColor: active ? '#3b82f6' : '#334155',
                background: active ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                color: active ? '#60a5fa' : '#94a3b8',
                cursor: 'pointer', textAlign: 'left', fontWeight: 'bold'
            }}>
            {label}
        </button>
    );
}

function DraggableItem({ type, icon, onDragStart }: any) {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            style={{
                padding: 15, background: '#334155', borderRadius: 8,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                cursor: 'grab'
            }}>
            <div style={{ fontSize: 24 }}>{icon}</div>
            <div style={{ fontSize: 12 }}>{type}</div>
        </div>
    );
}

function Room({ name }: any) {
    return (
        <div style={{ border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 14, fontWeight: 'bold' }}>
            {name}
        </div>
    );
}
