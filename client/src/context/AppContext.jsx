import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

const getAuthState= async () => {
    try {

        const {data} = await axios.get(backendUrl + '/api/auth/is-auth')
        if(data.success){
            setIsLoggedIn(true);
            getUserData();
        }
    }

    catch (error) {
        toast.error.message
    }
}

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/data', {
        withCredentials: true
      });
      
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch user data");
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);


  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
