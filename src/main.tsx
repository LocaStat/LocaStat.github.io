import { createRoot } from "react-dom/client";
import AppRoot from "./AppRoot.tsx";
import "./index.css";

const redirect = sessionStorage.redirect
delete sessionStorage.redirect

createRoot(document.getElementById("root")!).render(<AppRoot />);

if (redirect) {
    window.history.replaceState(null, null, redirect)
}