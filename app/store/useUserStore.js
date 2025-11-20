import { create } from "zustand";

const useUserStore = create((set) => ({
  favourites: [],
  rideInfo: null,

  setFavourites: (favourites) =>
    set({
      favourites,
    }),
  setRideInfo: (rideInfo) =>
    set({
      rideInfo,
    }),
}));
export default useUserStore;
