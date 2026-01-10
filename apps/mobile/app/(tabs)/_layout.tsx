import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#2ecc71' }}>
            <Tabs.Screen
                name="feed"
                options={{
                    title: 'Feed',
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    title: 'Map',
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
