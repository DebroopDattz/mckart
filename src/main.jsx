import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client"; // <-- import ReactDOM from react-dom/client
import { BrowserRouter } from "react-router-dom";
import App from "./App"; // make sure the path is correct

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
