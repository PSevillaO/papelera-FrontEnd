import { createContext, useContext } from "react";

export const UserContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext)