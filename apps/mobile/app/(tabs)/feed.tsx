import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { PropertyCard } from '@propmubi/ui';
import { useRouter } from 'expo-router';

// Full Screen Height for TikTok feel
const { height } = Dimensions.get('window');
const ITEM_HEIGHT = height - 80; // Minus tab bar

export default function FeedScreen() {
    const router = useRouter();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating API Fetch
        setTimeout(() => {
            setData([
                { id: '1', name: 'My Home Mangala', price: '₹1.25 Cr', image: 'https://via.placeholder.com/400x800', score: 92 },
                { id: '2', name: 'Prestige High Fields', price: '₹2.10 Cr', image: 'https://via.placeholder.com/400x800', score: 88 }
            ]);
            setLoading(false);
        }, 500);
    }, []);

    if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <FlatList
                data={data}
                keyExtractor={item => item.id}
                pagingEnabled
                decelerationRate="fast"
                snapToInterval={ITEM_HEIGHT}
                renderItem={({ item }) => (
                    <View style={{ height: ITEM_HEIGHT }}>
                        <PropertyCard
                            title={item.name}
                            price={item.price}
                            imageUrl={item.image}
                            trustScore={item.score}
                            onPress={() => router.push(`/property/${item.id}`)}
                        />
                    </View>
                )}
            />
        </View>
    );
}
