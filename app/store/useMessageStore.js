import { create } from "zustand";

const useMessageStore = create((set) => ({
  driver: [],
  user: [],
  both: [],
  reasons: [],

  setMessages: (data) =>
    set({
      driver: data.driver || [],
      user: data.user || [],
      both: data.both || [],
      reasons: data.reasons || [],
    }),
}));
export default useMessageStore;
