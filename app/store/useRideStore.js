import { create } from "zustand";

export const useRideStore = create((set) => ({
  origin: { place_id: "", description: "", coords: {lat: '', lng: ''}, secondaryText: '' },
  destination: { place_id: "", description: "", coords: {lat: '', lng: ''}, secondaryText: '' },
  fare: null,
  distance: null,
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
  setDistance: (distance) => set({ distance }),

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
