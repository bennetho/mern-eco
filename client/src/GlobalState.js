import React, { createContext, useState, useEffect } from "react";
import ProductsAPI from "./components/api/ProductsAPI";
import UserAPI from "./components/api/UserAPI";
import CategoriesAPI from "./components/api/CategoriesAPI";

import axios from "axios";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  useEffect(() => {
    const refreshToken = async () => {
      const res = await axios.get("/user/refresh_token");

      setToken(res.data.accesstoken);
      setTimeout(() => {
        refreshToken();
      }, 10 * 60 * 1000);
    };
    refreshToken();
  }, []);

  const state = {
    token: [token, setToken],
    productsAPI: ProductsAPI(),
    userAPI: UserAPI(token),
    categoriesAPI: CategoriesAPI(),
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
