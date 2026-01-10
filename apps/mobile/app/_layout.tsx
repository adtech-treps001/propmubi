import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="property/[id]" options={{ title: 'Property Details' }} />
            <Stack.Screen name="loans/eligibility" options={{ title: 'Financial Confidence' }} />
        </Stack>
    );
}
