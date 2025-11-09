import { create } from "zustand";

export const useRideStore = create((set) => ({
  origin: { place_id: "", description: "", coords: {lat: '', lng: ''}, secondaryText: '' },
  destination: { place_id: "", description: "", coords: {lat: '', lng: ''}, secondaryText: '' },
  fare: null,
  finalFare: null,
  fares: {},
  distance: null,
  duration: null,
  distanceKm: null,
  durationMin: null,
  transportMode: null,
  category: null,
  paymentMethod: null,

  setOrigin: (origin, options = { replace: false }) =>
    set((state) => ({
      origin: options.replace
        ? origin 
        : { ...state.origin, ...origin },
    })),

  setDestination: (destination, options = { replace: false }) =>
    set((state) => ({
      destination: options.replace
        ? destination
        : { ...state.destination, ...destination },
    })),
  setFare: (fare) => set({ fare }),
  setFinalFare: (finalFare) => set({ finalFare }),
  setFares: (fares) => set({ fares }),
  setDistance: (distance) => set({ distance }),
  setDuration: (duration) => set({ duration }),
  setDistanceKm: (distanceKm) => set({ distanceKm }),
  setDurationMin: (durationMin) => set({ durationMin }),

  setTransportMode: (transportMode) => set({ transportMode }),
  setCategory: (category) => set({ category }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

  setLocation: (key, data, replace = false) =>
    set((state) => ({
      [key]: replace ? data : { ...state[key], ...data },
    })),

  resetRide: () =>
    set({
      origin: { place_id: "", description: "", coords: {lat: '', lng: ''}, secondaryText: '' },
      destination: { place_id: "", description: "", coords: {lat: '', lng: ''}, secondaryText: '' },
      fare: null,
      distance: null,
      vehicle: null,
      category: null,
      paymentMode: null,
    }),
    resetDestination: () =>
    set({
      destination: { place_id: "", description: "", coords: {lat: '', lng: ''}, secondaryText: '' }
    }),
}));
