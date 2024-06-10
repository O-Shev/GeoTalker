import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {MapboxProvider} from "./context/MapboxContext";
import {WiretapsProvider} from "./context/WiretapsContext";
import {BoundariesProvider} from "./context/BoundariesContext";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {BreakpointFeatureProvider} from "./context/BreakpointFeatureContext";
import {BrowserRouter} from "react-router-dom";
import {SnackbarProvider} from "notistack";
import {UserAccountProvider} from "./context/UserAccountContext";
import {GoogleOAuthProvider} from "@react-oauth/google";


const mapboxOptions = {
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [45, 35],
    zoom: 2,
    attributionControl: false
    // projection: 'mercator'
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH2_GOOGLE_CLIENT_ID}>
        <UserAccountProvider>
        <SnackbarProvider maxSnack={5} autoHideDuration={4000} preventDuplicate>
        <BreakpointFeatureProvider>
                <BoundariesProvider >
                    <WiretapsProvider>
                        <MapboxProvider options={mapboxOptions}>
                            <App />
                        </MapboxProvider>
                    </WiretapsProvider>
                </BoundariesProvider>
        </BreakpointFeatureProvider>
        </SnackbarProvider>
        </UserAccountProvider>
        </GoogleOAuthProvider>
    </BrowserRouter>
);
