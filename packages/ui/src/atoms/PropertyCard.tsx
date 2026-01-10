import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export interface PropertyCardProps {
    title: string;
    price: string;
    imageUrl: string;
    trustScore?: number;
    onPress?: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
    title,
    price,
    imageUrl,
    trustScore,
    onPress
}) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.overlay}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.price}>{price}</Text>
                {trustScore && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Trust Score: {trustScore}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        margin: 10,
        backgroundColor: '#fff',
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 200,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        padding: 10,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    price: {
        color: '#FFD700',
        fontSize: 16,
        marginTop: 4,
    },
    badge: {
        position: 'absolute',
        top: -180,
        right: 10,
        backgroundColor: '#2ecc71',
        padding: 6,
        borderRadius: 8,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    }
});
