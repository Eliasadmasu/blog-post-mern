import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }) => {
  const initialUser = Cookies.get("authToken") || null;
  const initialUsername = Cookies.get("username") || null;
  const initialRefreshtoken = Cookies.get("refreshToken") || null;

  const [user, setUser] = useState(initialUser);
  const [username, setUsername] = useState(initialUsername);
  const [refreshToken, setRefreshToken] = useState(initialRefreshtoken);

  // Function to update user state
  const updateUser = (newUser, newUsername) => {
    setUser(newUser);
    setUsername(newUsername);
  };
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        username,
        setUsername,
        updateUser,
        refreshToken,
        setRefreshToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
