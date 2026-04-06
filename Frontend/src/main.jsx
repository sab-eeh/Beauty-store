import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import useAppStore from "./store/useAppStore.js";
import useAuthStore from "./store/useAuthStore.js";

useAppStore.getState().hydrateCart();
useAppStore.getState().hydrateOrders();
useAuthStore.getState().hydrateAuth();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
