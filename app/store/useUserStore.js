import { create } from "zustand";

const useUserStore = create((set) => ({
  driverStatus: null,
  favourites: [],
  rideInfo: null,
  balance: 0,
  walletTransactions: null,

  setDriverStatus: (driverStatus) => set({ driverStatus }),
  setFavourites: (favourites) =>
    set({
      favourites,
    }),
  setRideInfo: (rideInfo) =>
    set({
      rideInfo,
    }),
  setBalance: (balance) => set({ balance }),
  setWalletTransactions: (walletTransactions) => set({ walletTransactions }),
}));
export default useUserStore;
