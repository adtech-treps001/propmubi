"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // User requested "Main Page is Consumer"
        router.push('/consumer');
    }, [router]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'black', color: 'white' }}>
            <h1>PropMubi Trust OS</h1>
            <p>Redirecting to Consumer Experience...</p>
        </div>
    );
}
