import { create } from "zustand";

let nextId = 2;

export const useWorkspaceStore = create((set, get) => ({
  workspaces: [
    {
      id: "ws-1",
      name: "Default",
      visibility: "Private",
      createdAt: Date.now(),
    },
  ],
  boards: [],
  updateBoard: (updatedBoard) =>
    set((state) => ({
      boards: state.boards.map((b) =>
        b.id === updatedBoard.id && b.workspaceId === updatedBoard.workspaceId
          ? updatedBoard
          : b
      ),
    })),
  currentWorkspaceId: "ws-1",

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

  deleteBoard: (boardId) => {
    set((state) => ({
      boards: state.boards.filter((b) => b.id !== boardId),
    }));
  },

  getBoards: (workspaceId) => {
    return get().boards.filter((b) => b.workspaceId === workspaceId);
  },

  getWorkspaces: () => {
    return get().workspaces;
  },
}));