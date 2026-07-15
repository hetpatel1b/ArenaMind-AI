'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type OperatorRole =
  'EXECUTIVE' | 'SECURITY' | 'MEDICAL' | 'TRANSPORT' | 'INFRASTRUCTURE' | 'VOLUNTEER';

interface OperatorState {
  role: OperatorRole;
  pinnedItems: string[];
  recentSearches: string[];
}

interface OperatorContextType {
  state: OperatorState;
  setRole: (role: OperatorRole) => void;
  togglePin: (id: string) => void;
  addRecentSearch: (query: string) => void;
}

const OperatorContext = createContext<OperatorContextType | undefined>(undefined);

export function OperatorProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OperatorState>({
    role: 'EXECUTIVE',
    pinnedItems: [],
    recentSearches: [],
  });

  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('arenamind_operator_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => setState(parsed), 0);
      } catch (e) {}
    }
    setTimeout(() => setHydrated(true), 0);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('arenamind_operator_v1', JSON.stringify(state));
    }
  }, [state, hydrated]);

  const setRole = (role: OperatorRole) => setState((s) => ({ ...s, role }));

  const togglePin = (id: string) => {
    setState((s) => ({
      ...s,
      pinnedItems: s.pinnedItems.includes(id)
        ? s.pinnedItems.filter((i) => i !== id)
        : [...s.pinnedItems, id],
    }));
  };

  const addRecentSearch = (query: string) => {
    setState((s) => {
      const filtered = s.recentSearches.filter((q) => q !== query);
      return { ...s, recentSearches: [query, ...filtered].slice(0, 5) };
    });
  };

  return (
    <OperatorContext.Provider value={{ state, setRole, togglePin, addRecentSearch }}>
      {children}
    </OperatorContext.Provider>
  );
}

export const useOperator = () => {
  const context = useContext(OperatorContext);
  if (!context) throw new Error('useOperator must be used within OperatorProvider');
  return context;
};
