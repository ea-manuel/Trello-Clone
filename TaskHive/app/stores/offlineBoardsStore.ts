import { create } from "zustand";

export interface OfflineBoard {
  id: string;
  title: string;
}

interface OfflineBoardsStore {
  boards: OfflineBoard[];
  addBoard: (board: OfflineBoard) => void;
  removeBoard: (id: string) => void;
  clearBoards: () => void;
}

export const useOfflineBoardsStore = create<OfflineBoardsStore>((set) => ({
  boards: [],
  addBoard: (board) =>
    set((state) => ({
      boards: state.boards.some((b) => b.id === board.id)
        ? state.boards
        : [...state.boards, board],
    })),
  removeBoard: (id) =>
    set((state) => ({
      boards: state.boards.filter((b) => b.id !== id),
    })),
  clearBoards: () => set({ boards: [] }),
})); 