import { useUser } from "@clerk/nextjs";
import { useReducer, useEffect, useCallback } from "react";
import axios from "axios";

function reducer(state: any, { payload }: { payload: any }) {
  return {
    ...state,
    email: payload.email,
    accessLevel: payload.accessLevel,
    rootAccessId: payload.rootAccessId,
  };
}

async function fetchUserData(email: any) {
  const { data: userData } = await axios.post("/api/get-user", { email: email });

  return {
    email: userData.email,
    accessLevel: userData.accessLevel,
    rootAccessId: userData.rootFolderAccess,
  };
}

export default function useCurrentUser(accessLevel = null, rootAccessId = null) {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const userData = fetchUserData(email); 

  const [state, dispatch] = useReducer(reducer, {
    email,
    accessLevel,
    rootAccessId,
  });

  const loadData = useCallback(async () => {
    if (email !== null) {
      const fileData = await fetchUserData(email);
      dispatch({
        payload: {
          ...fileData,
        },
      });
    }
  }, [email]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return state;
}