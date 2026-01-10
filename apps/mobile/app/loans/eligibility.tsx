import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Input } from '@propmubi/ui';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    monthly_surplus: z.string().min(1, "Income is required"),
    credit_score: z.string().min(3, "Credit Score is required"),
    asset_value: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LoanEligibilityScreen() {
    const router = useRouter();
    const [result, setResult] = useState<any>(null);

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            monthly_surplus: '',
            credit_score: '',
            asset_value: ''
        }
    });

    const onSubmit = async (data: FormData) => {
        // Determine Logic Locally (Mirroring Backend for Immediate UI Feedback)
        const income = parseInt(data.monthly_surplus);
        const credit = parseInt(data.credit_score);
        const assets = parseInt(data.asset_value || '0');

        // Simple Simulation of Trust Engine Logic
        let score = 50;
        if (income > 100000) score += 20;
        if (credit > 750) score += 20;
        if (assets > 5000000) score += 10;

        let tier = "Bronze";
        if (score > 90) tier = "Platinum";
        else if (score > 75) tier = "Gold";
        else if (score > 60) tier = "Silver";

        setResult({ score, tier, max_loan: income * 60 }); // 60x multiplier
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Check Loan Eligibility</Text>
            <Text style={styles.subtext}>Get your "Financial Confidence" Tier instantly.</Text>

            {!result ? (
                <View style={styles.form}>
                    <Controller
                        control={control}
                        name="monthly_surplus"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Monthly Surplus Income (₹)"
                                placeholder="e.g. 150000"
                                keyboardType="numeric"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.monthly_surplus && <Text style={styles.error}>{errors.monthly_surplus.message}</Text>}

                    <Controller
                        control={control}
                        name="credit_score"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Credit Score (Approx)"
                                placeholder="e.g. 780"
                                keyboardType="numeric"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.credit_score && <Text style={styles.error}>{errors.credit_score.message}</Text>}

                    <Controller
                        control={control}
                        name="asset_value"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Declared Property Assets (₹) (Optional)"
                                placeholder="e.g. 8000000"
                                keyboardType="numeric"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />

                    <Button title="Calculate Tier" onPress={handleSubmit(onSubmit)} />
                </View>
            ) : (
                <View style={styles.result}>
                    <Text style={styles.resultTitle}>You are a</Text>
                    <Text style={[styles.tier, { color: result.tier === 'Platinum' ? '#2ecc71' : '#f1c40f' }]}>
                        {result.tier} Buyer
                    </Text>
                    <Text style={styles.score}>Trust Score: {result.score}/100</Text>

                    <View style={styles.card}>
                        <Text style={styles.cardLabel}>Est. Loan Eligibility</Text>
                        <Text style={styles.cardValue}>₹ {(result.max_loan / 100000).toFixed(1)} Lakhs</Text>
                    </View>

                    <Button title="Recalculate" variant="outline" onPress={() => setResult(null)} />
                    <Button title="View Eligible Properties" onPress={() => router.push('/(tabs)/feed')} />
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50' },
    subtext: { color: '#7f8c8d', marginBottom: 30 },
    form: { gap: 10 },
    error: { color: 'red', fontSize: 12 },
    result: { alignItems: 'center', marginTop: 20 },
    resultTitle: { fontSize: 18, color: '#7f8c8d' },
    tier: { fontSize: 40, fontWeight: 'bold', marginBottom: 10 },
    score: { fontSize: 16, color: '#34495e', marginBottom: 30 },
    card: { width: '100%', backgroundColor: '#f8f9fa', padding: 20, borderRadius: 10, marginBottom: 20, alignItems: 'center' },
    cardLabel: { color: '#7f8c8d', fontSize: 14 },
    cardValue: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginTop: 5 }
});
