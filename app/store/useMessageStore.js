import { create } from "zustand";

const useMessageStore = create((set) => ({
  driver: [],
  user: [],
  both: [],
  reasons: [],
  rejectReasons: [],

  setMessages: (data) =>
    set({
      driver: data.driver || [],
      user: data.user || [],
      both: data.both || [],
      reasons: data.reasons || [],
      rejectReasons: data.rejectReasons || [],
    }),
}));
export default useMessageStore;
