import { create } from "zustand";
import * as Crypto from "expo-crypto";

type NotificationType = "info" | "warning" | "error" | "success";

interface Notification {
  id: string;
  type: NotificationType;
  text: string;
  timestamp: number;
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: { type: NotificationType; text: string }) => Promise<void>;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

async function generateUUID() {
  // Create a pseudo-UUID by hashing the current time + random number
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    Date.now().toString() + Math.random().toString()
  );
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  addNotification: async ({ type, text }) => {
    const id = await generateUUID();

    set((state: NotificationStore) => ({
      notifications: [
        {
          id,
          type,
          text,
          timestamp: Date.now(),
          read: false,
        },
        ...state.notifications,
      ],
    }));
  },

  markAsRead: (id: string) =>
    set((state: NotificationStore) => ({
      notifications: state.notifications.map((n: Notification) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  clearAll: () => set({ notifications: [] }),
}));
