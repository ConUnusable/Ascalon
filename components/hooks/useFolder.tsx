import { useReducer, useEffect, useCallback } from "react";
import axios from "axios";

const ACTIONS = {
  SELECT_FOLDER: "select-folder",
  UPDATE_FOLDER: "update-folder",
  ADD_FOLDER: "add-folder",
  DELETE_FOLDER: "delete-folder",
  RENAME_FOLDER: "rename-folder",
  MOVE_FOLDER: "move-folder"
};

function reducer(state: any, { type, payload }: { type: string; payload: any }) {
  switch (type) {
    
    case ACTIONS.SELECT_FOLDER:
      return {
        folderId: payload.folderId,
        folder: payload.folder,
        childFiles: [],
        childFolders: [],
        path: payload.path,
      };
    case ACTIONS.UPDATE_FOLDER:
      return {
        ...state,
        folder: payload.folder,
        folderId: payload.folderId,
        childFiles: payload.childFiles,
        childFolders: payload.childFolders,
        path: payload.path,
      };
    case ACTIONS.ADD_FOLDER:
      return {
        ...state,
        childFolders: [...state.childFolders, payload.newFolder],
      };
      case ACTIONS.DELETE_FOLDER:
      return {
        ...state,
        childFolders: state.childFolders.filter((folder: any) => folder.folderId !== payload.folderId)
      };
    case ACTIONS.RENAME_FOLDER:
      return {
        ...state,
        childFolders: state.childFolders.map((folder: any) => 
          folder.folderId === payload.folderId 
            ? {...folder, folder: payload.newName}
            : folder
        )
      };
    case ACTIONS.MOVE_FOLDER:
      return {
        ...state,
        childFolders: state.childFolders.filter((folder: any) => folder.folderId !== payload.folderId)
      };
    default:
      return state;
  }
}

async function fetchFolderData(folderId: string) {
  const query = { folderId: folderId };
  const { data: folderData } = await axios.post(`/api/get-folder`, query);
  const { data: childFolders } = await axios.post(`/api/get-children`, query);
  const { data: childFiles } = await axios.post(`/api/get-files`, query);
  
  let path = [{ folder: folderData.folder, folderId: folderData.folderId }];
  let parentFolderId = folderData.parentId;

  while (parentFolderId !== "0") {
    const { data: parentData } = await axios.post(`/api/get-folder`, { folderId: parentFolderId });
    path.unshift({ folder: parentData.folder, folderId: parentData.folderId });
    parentFolderId = parentData.parentId;
  }

  return {
    folder: folderData.folder,
    folderId: folderData.folderId,
    childFiles,
    childFolders,
    path,
  };
}

export default function useFolder(folderId: any, folder = null, path = [{ folder: "Root", folderId: "0" }]) {
  const [state, dispatch] = useReducer(reducer, {
    folderId,
    folder,
    childFolders: [],
    childFiles: [],
    path,
  });

  useEffect(() => {
    dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folderId, folder } });
  }, [folderId, folder]);

  const loadData = useCallback(async () => {
    if (folderId === "0") {
      const query = { folderId: "0" };
      const { data: childFolders } = await axios.post(`/api/get-children`, query);
      dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: {
          folder: "Root",
          folderId: "0",
          childFolders,
          childFiles : [],
          path: [{ folder: "Root", folderId: "0" }],
        },
      });
    } else if (folderId != null) {
      const folderData = await fetchFolderData(folderId);
      dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: {
          ...folderData,
        },
      });
    }
  }, [folderId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addFolder = (newFolder: any) => {
    dispatch({
      type: ACTIONS.ADD_FOLDER,
      payload: { newFolder },
    });
  };

  const deleteFolder = (folderId: string) => {
    dispatch({
      type: ACTIONS.DELETE_FOLDER,
      payload: { folderId }
    });
  };

  const renameFolder = (folderId: string, newName: string) => {
    dispatch({
      type: ACTIONS.RENAME_FOLDER,
      payload: { folderId, newName }
    });
  };

  const moveFolder = (folderId: string) => {
    dispatch({
      type: ACTIONS.MOVE_FOLDER,
      payload: { folderId }
    });
  };

  return { 
    ...state, 
    addFolder,
    deleteFolder,
    renameFolder,
    moveFolder 
  };
}