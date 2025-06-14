import { create } from "zustand";

const BADGE_COLORS = [
  "#2980B9", "#00C6AE", "#007CF0", "#636B2F", "#8E44AD", "#FF7F7F", "#FFA500",
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * BADGE_COLORS.length);
  return BADGE_COLORS[randomIndex];
};

let nextId = 2;

export const useWorkspaceStore = create((set, get) => ({
  workspaces: [
    {
      id: "ws-1",
      name: "Default",
      visibility: "Private",
      createdAt: Date.now(),
      badgeColor: "#2980B9", // Assign fixed color for default workspace
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
      badgeColor: getRandomColor(), // Assign random color for new workspaces
    };
    set((state) => ({
      workspaces: [...state.workspaces, newWorkspace],
      currentWorkspaceId: newWorkspace.id,
    }));
    return newWorkspace;
  },

  editWorkspace: (id, { name, visibility, badgeColor }) => {
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === id ? { ...ws, name, visibility, badgeColor: badgeColor ?? ws.badgeColor } : ws
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