import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BADGE_COLORS = [
  "#2980B9", "#00C6AE", "#007CF0", "#636B2F", "#8E44AD", "#FF7F7F", "#FFA500",
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * BADGE_COLORS.length);
  return BADGE_COLORS[randomIndex];
};

// Storage keys
const WORKSPACES_STORAGE_KEY = "taskhive_workspaces";
const BOARDS_STORAGE_KEY = "taskhive_boards";
const CURRENT_WORKSPACE_KEY = "taskhive_current_workspace";

export const useWorkspaceStore = create((set, get) => ({
  workspaces: [],
  boards: [],
  currentWorkspaceId: null,
  isLoading: false,

  // Initialize store from AsyncStorage
  initializeStore: async () => {
    try {
      set({ isLoading: true });
      
      // Load workspaces
      const workspacesData = await AsyncStorage.getItem(WORKSPACES_STORAGE_KEY);
      const workspaces = workspacesData ? JSON.parse(workspacesData) : [];
      
      // Load boards
      const boardsData = await AsyncStorage.getItem(BOARDS_STORAGE_KEY);
      const boards = boardsData ? JSON.parse(boardsData) : [];
      
      // Load current workspace
      const currentWorkspaceId = await AsyncStorage.getItem(CURRENT_WORKSPACE_KEY);
      
      // If no workspaces exist, create a default one
      if (workspaces.length === 0) {
        const defaultWorkspace = {
          id: "default-workspace",
          name: "My Workspace",
          visibility: "Private",
          badgeColor: getRandomColor(),
          createdAt: Date.now(),
        };
        
        workspaces.push(defaultWorkspace);
        await AsyncStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(workspaces));
      }
      
      set({ 
        workspaces, 
        boards, 
        currentWorkspaceId: currentWorkspaceId || workspaces[0]?.id,
        isLoading: false 
      });
      
      console.log("Store initialized with", workspaces.length, "workspaces and", boards.length, "boards");
    } catch (error) {
      console.error("Failed to initialize store:", error);
      set({ isLoading: false });
    }
  },

  // ✅ CREATE WORKSPACE (Local)
  createWorkspace: async ({ name, visibility }) => {
    try {
      const newWorkspace = {
        id: `workspace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name || "New Workspace",
        visibility: visibility || "Private",
        badgeColor: getRandomColor(),
        createdAt: Date.now(),
      };

      const updatedWorkspaces = [...get().workspaces, newWorkspace];
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(updatedWorkspaces));
      
      set((state) => ({
        workspaces: updatedWorkspaces,
        currentWorkspaceId: newWorkspace.id,
      }));

      console.log("Created workspace:", newWorkspace);
      return newWorkspace;
    } catch (error) {
      console.error("Failed to create workspace:", error);
      throw error;
    }
  },

  // ✅ FETCH USER WORKSPACES (Local)
  getUserWorkspaces: async () => {
    try {
      const workspacesData = await AsyncStorage.getItem(WORKSPACES_STORAGE_KEY);
      const workspaces = workspacesData ? JSON.parse(workspacesData) : [];
      
      // If no workspaces exist, create default
      if (workspaces.length === 0) {
        const defaultWorkspace = {
          id: "default-workspace",
          name: "My Workspace",
          visibility: "Private",
          badgeColor: getRandomColor(),
          createdAt: Date.now(),
        };
        
        workspaces.push(defaultWorkspace);
        await AsyncStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(workspaces));
      }
      
      set({ workspaces });
      return workspaces;
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
    }
  },

  // ✅ UPDATE WORKSPACE LOCALLY
  editWorkspace: async (id, { name, visibility, badgeColor }) => {
    try {
      const updatedWorkspaces = get().workspaces.map((ws) =>
        ws.id === id
          ? {
              ...ws,
              name: name || ws.name,
              visibility: visibility || ws.visibility,
              badgeColor: badgeColor ?? ws.badgeColor,
            }
          : ws
      );
      
      await AsyncStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(updatedWorkspaces));
      set({ workspaces: updatedWorkspaces });
    } catch (error) {
      console.error("Failed to edit workspace:", error);
      throw error;
    }
  },

  // ✅ DELETE WORKSPACE
  deleteWorkspace: async (id) => {
    try {
      const updatedWorkspaces = get().workspaces.filter((ws) => ws.id !== id);
      const updatedBoards = get().boards.filter((board) => board.workspaceId !== id);
      
      await AsyncStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(updatedWorkspaces));
      await AsyncStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(updatedBoards));
      
      set({ 
        workspaces: updatedWorkspaces,
        boards: updatedBoards,
        currentWorkspaceId: updatedWorkspaces.length > 0 ? updatedWorkspaces[0].id : null
      });
    } catch (error) {
      console.error("Failed to delete workspace:", error);
      throw error;
    }
  },

  setCurrentWorkspaceId: async (id) => {
    try {
      await AsyncStorage.setItem(CURRENT_WORKSPACE_KEY, id);
      set({ currentWorkspaceId: id });
    } catch (error) {
      console.error("Failed to set current workspace:", error);
    }
  },

  // ✅ CREATE BOARD (Local)
  createBoard: async ({ title, workspaceId, backgroundColor }) => {
    try {
      const newBoard = {
        id: `board-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title || "New Board",
        workspaceId: workspaceId || get().currentWorkspaceId,
        backgroundColor: backgroundColor || "#ADD8E6",
        createdAt: Date.now(),
        lists: [],
        isFavorite: false,
      };

      const updatedBoards = [...get().boards, newBoard];
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(updatedBoards));
      
      set((state) => ({
        boards: updatedBoards,
      }));
      
      console.log("Created board:", newBoard);
      return newBoard;
    } catch (error) {
      console.error("Failed to create board:", error);
      throw error;
    }
  },

  // ✅ GET BOARDS BY WORKSPACE
  getBoards: async (workspaceId) => {
    try {
      const boardsData = await AsyncStorage.getItem(BOARDS_STORAGE_KEY);
      const allBoards = boardsData ? JSON.parse(boardsData) : [];
      const workspaceBoards = allBoards.filter(board => board.workspaceId === workspaceId);
      
      set({ boards: workspaceBoards });
      return workspaceBoards;
    } catch (error) {
      console.error("Failed to get boards:", error);
      return [];
    }
  },

  // ✅ UPDATE BOARD
  updateBoard: async (boardId, updates) => {
    try {
      const updatedBoards = get().boards.map(board =>
        board.id === boardId ? { ...board, ...updates } : board
      );
      
      await AsyncStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(updatedBoards));
      set({ boards: updatedBoards });
    } catch (error) {
      console.error("Failed to update board:", error);
      throw error;
    }
  },

  // ✅ DELETE BOARD
  deleteBoard: async (boardId) => {
    try {
      const updatedBoards = get().boards.filter(board => board.id !== boardId);
      await AsyncStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(updatedBoards));
      set({ boards: updatedBoards });
    } catch (error) {
      console.error("Failed to delete board:", error);
      throw error;
    }
  },

  // ✅ CLEAR ALL DATA (for logout)
  clearAllData: async () => {
    try {
      await AsyncStorage.multiRemove([
        WORKSPACES_STORAGE_KEY,
        BOARDS_STORAGE_KEY,
        CURRENT_WORKSPACE_KEY
      ]);
      set({ workspaces: [], boards: [], currentWorkspaceId: null });
    } catch (error) {
      console.error("Failed to clear data:", error);
    }
  },
}));
