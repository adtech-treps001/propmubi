import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '@propmubi/ui';

export default function PropertyDetails() {
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);

    // Hardcoded for demo
    const property = {
        name: 'My Home Mangala',
        price: '₹1.25 Cr',
        location: 'Financial District, Hyderabad',
        score: 92,
        image: 'https://via.placeholder.com/600x400',
        description: 'A premium gated community with 75% open space.',
    };

    const handleBookVisit = async () => {
        setLoading(true);
        try {
            // Call Real API
            // Note: In Android Emulator use '10.0.2.2', for web use 'localhost'
            // We'll use localhost assuming you run this as "Web Mobile" for the demo
            const res = await fetch('http://localhost:8000/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ propertyId: id, userId: 'user-123' })
            });
            const data = await res.json();
            Alert.alert("Success", `Visit Booked! Queue Position: ${data.new_count}`);
        } catch (e) {
            Alert.alert("Error", "Could not connect to Trust OS");
        }
        setLoading(false);
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <Image source={{ uri: property.image }} style={styles.heroImage} />
                <View style={styles.content}>
                    <Text style={styles.title}>{property.name}</Text>
                    <Text style={styles.price}>{property.price}</Text>
                    <Text style={styles.description}>{property.description}</Text>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <Button title="Book Site Visit (Verified)" onPress={handleBookVisit} loading={loading} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    heroImage: { width: '100%', height: 250 },
    content: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold' },
    price: { fontSize: 20, color: '#2ecc71', fontWeight: 'bold', marginVertical: 4 },
    description: { lineHeight: 22, color: '#34495e', marginTop: 10 },
    footer: { padding: 20, borderTopWidth: 1, borderColor: '#eee', backgroundColor: 'white' }
});
