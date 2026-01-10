import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Input, Button } from '@propmubi/ui';

export default function LoginScreen() {
    const router = useRouter();
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        if (mobile.length < 10) return Alert.alert("Error", "Invalid Mobile Number");
        setLoading(true);
        // Simulating API Call
        setTimeout(() => {
            setLoading(false);
            setStep('OTP');
            Alert.alert("OTP Sent", "Use 0000");
        }, 1000);
    };

    const handleVerifyOtp = async () => {
        if (otp !== '0000') return Alert.alert("Error", "Invalid OTP");
        setLoading(true);
        // Simulating API Call
        setTimeout(() => {
            setLoading(false);
            router.replace('/(tabs)/feed');
        }, 1000);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>PropMubi</Text>
                <Text style={styles.subtitle}>Trust OS for Real Estate</Text>
            </View>

            <View style={styles.form}>
                {step === 'MOBILE' ? (
                    <>
                        <Input
                            label="Mobile Number"
                            placeholder="+91 99999 99999"
                            value={mobile}
                            onChangeText={setMobile}
                            keyboardType="numeric"
                        />
                        <Button title="Continue" onPress={handleSendOtp} loading={loading} />
                    </>
                ) : (
                    <>
                        <Text style={styles.otpText}>Enter OTP sent to {mobile}</Text>
                        <Input
                            placeholder="0000"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="numeric"
                        />
                        <Button title="Verify & Login" onPress={handleVerifyOtp} loading={loading} />
                        <Button title="Back" variant="outline" onPress={() => setStep('MOBILE')} />
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    header: { alignItems: 'center', marginBottom: 40 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#2c3e50' },
    subtitle: { fontSize: 16, color: '#7f8c8d', marginTop: 5 },
    form: { width: '100%' },
    otpText: { textAlign: 'center', marginBottom: 20, color: '#666' }
});
