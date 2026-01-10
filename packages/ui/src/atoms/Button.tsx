import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', loading }) => {
    return (
        <TouchableOpacity
            style={[styles.base, styles[variant]]}
            onPress={onPress}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? '#2ecc71' : 'white'} />
            ) : (
                <Text style={[styles.text, variant === 'outline' && styles.textOutline]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
    },
    primary: { backgroundColor: '#2ecc71' },
    secondary: { backgroundColor: '#34495e' },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#2ecc71' },
    text: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    textOutline: { color: '#2ecc71' }
});
