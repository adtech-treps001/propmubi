"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PersonaType = 'FAMILY' | 'INVESTOR' | 'NRI';

interface PersonaContextType {
    persona: PersonaType;
    setPersona: (p: PersonaType) => void;
    getPriorities: () => string[];
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({ children }: { children: ReactNode }) {
    const [persona, setPersona] = useState<PersonaType>('FAMILY');

    const getPriorities = () => {
        switch (persona) {
            case 'FAMILY': return ['Use & Livability', 'Safety', 'Schools', 'Community'];
            case 'INVESTOR': return ['ROI & Yield', 'Appreciation', 'Exit Liquidity', 'Price Trends'];
            case 'NRI': return ['Legal Safety', 'Asset Management', 'Remote Monitoring', 'Trusted Developer'];
            default: return [];
        }
    };

    return (
        <PersonaContext.Provider value={{ persona, setPersona, getPriorities }}>
            {children}
        </PersonaContext.Provider>
    );
}

export function usePersona() {
    const context = useContext(PersonaContext);
    if (!context) throw new Error("usePersona must be used within a PersonaProvider");
    return context;
}
