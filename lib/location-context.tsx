"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Location = {
  cep?: string;
  city: string;
  uf: string;
  district?: string;
  street?: string;
};

type LocationState = {
  location: Location | null;
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  setLocation: (loc: Location) => void;
  clearLocation: () => void;
};

const STORAGE_KEY = "bazam:location";

const LocationContext = createContext<LocationState | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<Location | null>(null);
  const [open, setOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLocationState(JSON.parse(raw) as Location);
    } catch {
      /* ignore */
    }
  }, []);

  const setLocation = useCallback((loc: Location) => {
    setLocationState(loc);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } catch {
      /* ignore */
    }
  }, []);

  const clearLocation = useCallback(() => {
    setLocationState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <LocationContext.Provider
      value={{ location, open, openModal, closeModal, setLocation, clearLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationState {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used inside LocationProvider");
  return ctx;
}
