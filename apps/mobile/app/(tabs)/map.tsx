import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
// Note: In real setup, run: npx expo install react-native-maps
// import MapView, { Polygon, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Mocking MapView for Scaffold (since native deps aren't present in this env)
const MockMapView = ({ style, children }: any) => (
    <View style={[style, { backgroundColor: '#e1e1e1', justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Interactive Map View</Text>
        <Text style={{ fontSize: 10, color: '#666' }}>(Satellite Mode)</Text>
        {children}
    </View>
);
const MockPolygon = (props: any) => <View />;
const MockMarker = (props: any) => <View />;

export default function MapScreen() {
    const [geoJson, setGeoJson] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch GeoJSON from our new Endpoint
        // fetch('http://localhost:8000/projects/map?lat=17.4&long=78.3')...

        // Simulating fetch
        setTimeout(() => {
            setLoading(false);
            setGeoJson({
                features: [
                    { properties: { name: "My Home Mangala", type: "PROJECT_BOUNDARY" } }
                ]
            });
        }, 1000);
    }, []);

    if (loading) return <ActivityIndicator style={styles.container} />;

    return (
        <View style={styles.container}>
            <MockMapView style={styles.map}>
                {geoJson?.features.map((feature: any, index: number) => {
                    if (feature.properties.type === 'PROJECT_BOUNDARY') {
                        return (
                            <MockPolygon
                                key={index}
                                coordinates={feature.geometry?.coordinates[0].map((c: any) => ({
                                    latitude: c[1],
                                    longitude: c[0]
                                }))}
                                fillColor="rgba(46, 204, 113, 0.3)"
                                strokeColor="#2ecc71"
                            />
                        );
                    }
                    return null;
                })}
            </MockMapView>

            {/* Overlay UI */}
            <View style={styles.overlay}>
                <Text style={styles.overlayText}>Browsing: Financial District</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    overlay: {
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 10,
        borderRadius: 20,
    },
    overlayText: { color: 'white', fontWeight: 'bold' }
});
