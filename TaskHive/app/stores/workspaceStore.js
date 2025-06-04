// app/stores/workspaceStore.js
import { create } from "zustand";

let nextId = 2;

export const useWorkspaceStore = create((set, get) => ({
  workspaces: [
    {
      id: "ws-1",
      name: "Default Workspace",
      visibility: "Private",
      createdAt: Date.now(),
    },
  ],
  boards: [],
  currentWorkspaceId: "ws-1",

  // Workspace actions
  createWorkspace: ({ name, visibility }) => {
    const newWorkspace = {
      id: `ws-${nextId++}`,
      name,
      visibility,
      createdAt: Date.now(),
    };
    set((state) => ({
      workspaces: [...state.workspaces, newWorkspace],
      currentWorkspaceId: newWorkspace.id,
    }));
    return newWorkspace;
  },

  editWorkspace: (id, { name, visibility }) => {
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === id ? { ...ws, name, visibility } : ws
      ),
    }));
  },

  setCurrentWorkspaceId: (id) => set({ currentWorkspaceId: id }),

  // Board actions
  createBoard: ({ title, workspaceId, backgroundColor }) => {
    const newBoard = {
      id: `board-${nextId++}`,
      title,
      workspaceId,
      backgroundColor,
      createdAt: Date.now(),
      lists: [],
    };
    set((state) => ({
      boards: [...state.boards, newBoard],
    }));
    return newBoard;
  },

  getBoards: (workspaceId) => {
    return get().boards.filter((b) => b.workspaceId === workspaceId);
  },

  // Optional utility function if needed elsewhere
  getWorkspaces: () => {
    return get().workspaces;
  },
}));
