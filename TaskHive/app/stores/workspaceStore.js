import { create } from "zustand";
import axiosClient from "../../src/api/axiosClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

 createWorkspace: async ({ name, visibility }) => {
  try {
    const token = await AsyncStorage.getItem("authToken"); // Get token

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axiosClient.post(
      "/workspaces",
      { name, visibility },
      {
        headers: {
          Authorization: `Bearer ${token}` // Attach token here
        }
      }
    );

    const newWorkspaceFromBackend = response.data;

    set((state) => ({
      workspaces: [...state.workspaces, newWorkspaceFromBackend],
      currentWorkspaceId: newWorkspaceFromBackend.id,
    }));

    return newWorkspaceFromBackend;
  } catch (error) {
    console.error("Failed to create workspace:", error.response?.data || error.message);
    throw error;
  }
},
getUserWorkspaces: async () => {
  try {
    const response = await axiosClient.get("/workspaces");
    set({ workspaces: response.data });
  } catch (error) {
    console.error("Failed to fetch workspaces:", error);
  }
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