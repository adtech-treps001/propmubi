import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface InputProps {
    label?: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: 'default' | 'numeric' | 'email-address';
    secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={styles.input}
                placeholderTextColor="#95a5a6"
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginVertical: 8 },
    label: { marginBottom: 6, fontWeight: '600', color: '#2c3e50' },
    input: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#dfe6e9',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#2d3436'
    }
});
