"use client";

import { PersonaProvider } from './context/PersonaContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PersonaProvider>
            {children}
        </PersonaProvider>
    );
}
