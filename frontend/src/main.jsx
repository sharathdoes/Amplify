import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RootLayout from "./RootLayout.jsx"; // Adjust the import path as necessary

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="378355759629-u605vb2ieq6mnbn6gniiomrive5c4kvf.apps.googleusercontent.com">
      <RootLayout>
        <App />
      </RootLayout>
    </GoogleOAuthProvider>
  </StrictMode>
);
