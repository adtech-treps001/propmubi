"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';

// Hyderabad/Tellapur Region
const CENTER = { lat: 17.46, lng: 78.29 };
const POLYGON_PATH = [
    { lat: 17.46, lng: 78.29 },
    { lat: 17.465, lng: 78.295 },
    { lat: 17.47, lng: 78.29 },
    { lat: 17.465, lng: 78.28 },
];

export default function AgentMap({ leads, supply }: any) {
    const [selectedMarker, setSelectedMarker] = useState<any>(null);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* LARGE BANNER OVERLAY */}
            <div style={{
                position: 'absolute',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 100,
                background: 'linear-gradient(90deg, #c0392b 0%, #e74c3c 100%)',
                color: 'white',
                padding: '10px 40px',
                borderRadius: 30,
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                fontWeight: 'bold',
                fontSize: 18,
                display: 'flex',
                alignItems: 'center',
                gap: 10
            }}>
                <span className="pulse-dot">🔴</span> LIVE INTEL: 42 New Signals in Tellapur
            </div>

            <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps Loaded')}>
                <Map
                    defaultCenter={CENTER}
                    defaultZoom={13}
                    mapId="DEMO_MAP_ID" // Required for AdvancedMarker
                    style={{ width: '100%', height: '100%' }}
                    gestureHandling={'greedy'}
                    disableDefaultUI={false}
                >
                    <PolygonLayer />

                    {/* Supply Markers */}
                    {supply.map((item: any, i: number) => {
                        const lat = 17.46 + (Math.random() * 0.02 - 0.01);
                        const lng = 78.29 + (Math.random() * 0.02 - 0.01);
                        return (
                            <AdvancedMarker
                                key={i}
                                position={{ lat, lng }}
                                onClick={() => setSelectedMarker({ ...item, type: 'supply', lat, lng })}
                            >
                                <Pin background={'#2ecc71'} borderColor={'#27ae60'} glyphColor={'#fff'} />
                            </AdvancedMarker>
                        );
                    })}

                    {/* Lead Markers */}
                    {leads.map((lead: any, i: number) => {
                        const lat = 17.46 + (Math.random() * 0.02 - 0.01);
                        const lng = 78.29 + (Math.random() * 0.02 - 0.01);
                        return (
                            <AdvancedMarker
                                key={`lead-${i}`}
                                position={{ lat, lng }}
                                onClick={() => setSelectedMarker({ ...lead, type: 'lead', lat, lng })}
                            >
                                <Pin background={'#3498db'} borderColor={'#2980b9'} glyphColor={'#fff'} />
                            </AdvancedMarker>
                        );
                    })}

                    {selectedMarker && (
                        <InfoWindow
                            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                            onCloseClick={() => setSelectedMarker(null)}
                        >
                            <div style={{ color: 'black', padding: 5 }}>
                                {selectedMarker.type === 'supply' ? (
                                    <>
                                        <strong>{selectedMarker.property_details?.property_name}</strong><br />
                                        ₹ {selectedMarker.property_details?.price?.toLocaleString()}
                                    </>
                                ) : (
                                    <>
                                        <strong>Buyer: {selectedMarker.buyer_id}</strong><br />
                                        Status: {selectedMarker.status}
                                    </>
                                )}
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </APIProvider>

            <style jsx global>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .pulse-dot {
                    display: inline-block;
                    animation: pulse 1.5s infinite;
                }
            `}</style>
        </div>
    );
}

function PolygonLayer() {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        // Create the Google Maps Polygon
        const polygon = new google.maps.Polygon({
            paths: POLYGON_PATH,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.15,
            editable: false,
            draggable: false
        });

        polygon.setMap(map);

        // Animation Loop (Pulse fill opacity)
        let direction = 1;
        let opacity = 0.15;
        const interval = setInterval(() => {
            opacity += 0.02 * direction;
            if (opacity > 0.4 || opacity < 0.1) direction *= -1;
            polygon.setOptions({ fillOpacity: opacity });
        }, 100);

        return () => {
            clearInterval(interval);
            polygon.setMap(null);
        };
    }, [map]);

    return null;
}
