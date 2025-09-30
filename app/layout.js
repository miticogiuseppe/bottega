"use client";
import "./globals.scss";
import { useState } from "react";
import { Provider } from "react-redux";
import store from "../shared/redux/store";
import { Initialload } from "../shared/layouts-components/contextapi";

const RootLayout = ({ children }) => {
  const [pageloading, setpageloading] = useState(false);

  return (
    <Provider store={store}>
      <Initialload.Provider value={{ pageloading, setpageloading }}>
        {children}
      </Initialload.Provider>
    </Provider>
  );
};
export default RootLayout;
