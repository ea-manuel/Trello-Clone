let workspaces = [];
let boards = [];
let nextId = 1;

// Create default workspace if none exist
if (workspaces.length === 0) {
  workspaces.push({
    id: `ws-${nextId++}`,
    name: "Default Workspace",
    visibility: "Private",
    createdAt: Date.now()
  });
}

export const createWorkspace = ({ name, visibility }) => {
  const workspace = { id: `ws-${nextId++}`, name, visibility, createdAt: Date.now() };
  workspaces.push(workspace);
  return workspace;
};

export const editWorkspace = (id, { name, visibility }) => {
  const index = workspaces.findIndex(ws => ws.id === id);
  if (index !== -1) {
    workspaces[index] = { ...workspaces[index], name, visibility };
    return workspaces[index];
  }
  return null;
};

export const getWorkspaces = () => {
  return workspaces;
};

export const createBoard = ({ title, workspaceId, backgroundColor }) => {
  const board = { 
    id: `board-${nextId++}`, 
    title, 
    workspaceId, 
    backgroundColor, 
    createdAt: Date.now(),
    lists: []
  };
  boards.push(board);
  return board;
};

export const getBoards = (workspaceId) => {
  return boards.filter(b => b.workspaceId === workspaceId);
};