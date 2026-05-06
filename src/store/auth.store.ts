import { create } from "zustand";

type User = {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
};

type AuthStore = {
  user: User | null;
  accessToken: string | null;

  setAuth: (data: { user: User; accessToken: string }) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,

  setAuth: ({ user, accessToken }) =>
    set({
      user,
      accessToken,
    }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
    }),
}));
