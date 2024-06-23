import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";

const urlParams = new URLSearchParams(window.location.search);
const colorScheme = urlParams.get('colorScheme') as 'light' | 'dark' | undefined;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme={colorScheme ?? "light"}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
