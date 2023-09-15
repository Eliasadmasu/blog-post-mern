import Cookies from "js-cookie";
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }) => {
  const initialUser = Cookies.get("authToken") || null;
  const initialUsername = Cookies.get("username") || null;

  const [user, setUser] = useState(initialUser);
  const [username, setUsername] = useState(initialUsername);
  return (
    <UserContext.Provider value={{ user, setUser, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};
