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
      badgeColor: "#2980B9",
    },
  ],
  boards: [],
  currentWorkspaceId: "ws-1",

  // ✅ CREATE WORKSPACE (Updated)
  createWorkspace: async ({ name, visibility }) => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axiosClient.post(
        "/workspaces",
        { name }, // visibility is not required by backend
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newWorkspace = {
        ...response.data,
        visibility: visibility || "Private",
        badgeColor: getRandomColor(),
      };

      set((state) => ({
        workspaces: [...state.workspaces, newWorkspace],
        currentWorkspaceId: newWorkspace.id,
      }));

      return newWorkspace;
    } catch (error) {
      console.error(
        "Failed to create workspace:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // ✅ FETCH USER WORKSPACES
  getUserWorkspaces: async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Token missing");

      const response = await axiosClient.get("/workspaces", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Add badgeColor to each workspace
      const workspacesWithColor = response.data.map((ws) => ({
        ...ws,
        badgeColor: getRandomColor(),
      }));

      set({ workspaces: workspacesWithColor });
    } catch (error) {
      console.error("Failed to fetch workspaces:", error.response?.data || error.message);
    }
  },

  // ✅ UPDATE WORKSPACE LOCALLY
  editWorkspace: (id, { name, visibility, badgeColor }) => {
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === id
          ? {
              ...ws,
              name,
              visibility,
              badgeColor: badgeColor ?? ws.badgeColor,
            }
          : ws
      ),
    }));
  },

  deleteWorkspace: async (id) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axiosClient.delete(`/workspaces/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        workspaces: state.workspaces.filter((ws) => ws.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete workspace:", error.response?.data || error.message);
      throw error;
    }
  },

  setCurrentWorkspaceId: (id) => set({ currentWorkspaceId: id }),


  // CREATE BOARD (Backend)
  createBoard: async ({ title, workspaceId, backgroundColor }) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axiosClient.post(
        "/api/boards",
        { title, workspaceId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newBoard = {
        ...response.data,
        backgroundColor: backgroundColor || "#ADD8E6",
        createdAt: Date.now(),
        lists: [],
        isFavorite: false,
      };
      set((state) => ({
        boards: [...state.boards, newBoard],
      }));
      return newBoard;
    } catch (error) {
      console.error("Failed to create board:", error.response?.data || error.message);
      throw error;
    }
  },

  // DELETE BOARD (Backend, if endpoint exists, else local only)
  deleteBoard: async (boardId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      // If you have a backend endpoint, uncomment the next line:
      // await axiosClient.delete(`/api/boards/${boardId}`, { headers: { Authorization: `Bearer ${token}` } });
      set((state) => ({
        boards: state.boards.filter((b) => b.id !== boardId),
      }));
    } catch (error) {
      console.error("Failed to delete board:", error.response?.data || error.message);
      throw error;
    }
  },

  // GET BOARDS (Backend, robust to non-array response)
  getBoards: async (workspaceId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axiosClient.get(`/api/boards/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const boardsArr = Array.isArray(response.data) ? response.data : [];
      set((state) => ({
        boards: boardsArr.map((b) => ({
          ...b,
          backgroundColor: b.backgroundColor || "#ADD8E6",
          lists: b.lists || [],
          isFavorite: b.isFavorite || false,
        })),
      }));
      return boardsArr;
    } catch (error) {
      console.error("Failed to fetch boards:", error.response?.data || error.message);
      throw error;
    }
  },

  getWorkspaces: () => {
    return get().workspaces;
  },

  // Add updateBoard function
  updateBoard: (updatedBoard) => {
    set((state) => ({
      boards: state.boards.map((b) =>
        b.id === updatedBoard.id ? { ...b, ...updatedBoard } : b
      ),
    }));
  },
}));
