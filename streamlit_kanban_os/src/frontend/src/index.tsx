import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import  Board  from "./Board";
import { withStreamlitConnection } from "streamlit-component-lib";


const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Board />
  </StrictMode>
);