import { create } from "zustand";

export const useRideStore = create((set) => ({
  id: 0,
  status: null,
  driverId: 0,
  riderId: 0,
  polyline: null,
  origin: {
    place_id: "",
    description: "",
    coords: null,
    secondaryText: "",
  },
  destination: {
    place_id: "",
    description: "",
    coords: null,
    secondaryText: "",
  },
  fare: null,
  finalFare: null,
  fares: { standard: "", premium: "", luxury: "", executive: "" },
  distance: null,
  duration: null,
  distanceKm: null,
  durationMin: null,
  transportMode: null,
  category: null,
  paymentMethod: null,

  setStatus: (status) => set({ status }),
  setDriverId: (driverId) => set({ driverId }),
  setRiderId: (riderId) => set({ riderId }),
  setOrigin: (origin, options = { replace: false }) =>
    set((state) => ({
      origin: options.replace ? origin : { ...state.origin, ...origin },
    })),

  setDestination: (destination, options = { replace: false }) =>
    set((state) => ({
      destination: options.replace
        ? destination
        : { ...state.destination, ...destination },
    })),
  setId: (id) => set({ id }),
  setPolyline: (polyline) => set({ polyline }),
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
      id: 0,
      status: null,
      driverId: 0,
      riderId: 0,
      polyline: null,
      origin: {
        place_id: "",
        description: "",
        coords: null,
        secondaryText: "",
      },
      destination: {
        place_id: "",
        description: "",
        coords: null,
        secondaryText: "",
      },
      fare: null,
      fares: { standard: "", premium: "", luxury: "", executive: "" },
      distance: null,
      vehicle: null,
      category: null,
      paymentMode: null,
    }),
  resetDestination: () =>
    set({
      destination: {
        place_id: "",
        description: "",
        coords: null,
        secondaryText: "",
      },
    }),
}));
