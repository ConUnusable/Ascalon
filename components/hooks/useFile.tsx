import { useReducer, useEffect, useCallback } from "react";
import axios from "axios";

const ACTIONS = {
  SELECT_FOLDER: "select-folder",
  UPDATE_FOLDER: "update-folder",
};

function reducer(state: any, { type, payload }: { type: string; payload: any }) {
  switch (type) {
    case ACTIONS.SELECT_FOLDER:
      return {
        file: payload.file,
        folderId: payload.folderId,
        fileId: payload.fileId,
        fileData: payload.fileData,
        fileCreatedAt: payload.fileCreatedAt,
        fileSize: payload.fileSize,
      };
    case ACTIONS.UPDATE_FOLDER:
      return {
        ...state,
        file: payload.file,
        folderId: payload.folderId,
        fileId: payload.fileId,
        fileData: payload.fileData,
        fileCreatedAt: payload.fileCreatedAt,
        fileSize: payload.fileSize,
      };
    default:
      return state;
  }
}

async function fetchFileData(folderId: string) {
  const query = { folderId: folderId };
  const { data: fileData } = await axios.post(`/api/get-files`, query);
  
  return {
    file: fileData.fileName,
    folderId: fileData.folderId,
    fileId: fileData.fileId,
    fileData: fileData.fileData,
    fileCreatedAt: fileData.createdAt,
    fileSize: 0,
  };
}

export default function useFile(folderId: any, file = null, fileId = null, fileData = null, fileCreatedAt = null, fileSize = null) {
  const [state, dispatch] = useReducer(reducer, {
    folderId,
    fileId,
    file,
    fileData,
    fileCreatedAt,
    fileSize,
  });

  useEffect(() => {
    dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folderId } });
  }, [folderId]);

  const loadData = useCallback(async () => {
    if (folderId !== "0" && folderId !== null) {
      const fileData = await fetchFileData(folderId);
      dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: {
          ...fileData,
        },
      });
    }
  }, [folderId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return state;
}