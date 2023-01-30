import React from "react";
import ReactDOM from "react-dom/client";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import App from "./App";
import { CalculationContextProvider } from "./CalculationsContext";

if (window.location.port !== "5173") {
    disableReactDevTools();
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <CalculationContextProvider>
            <App />
        </CalculationContextProvider>
    </React.StrictMode>
);
