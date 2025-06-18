import React, { JSX } from 'react'
import { BrowserRouter, Routes, Route, Navigate  } from "react-router";
import Layout from './layout.tsx';
import Login from './screens/Login';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Renting from './screens/Renting';
import Cars from './screens/Cars';
import Register from "./screens/Register";
import AboutUs from "./screens/AboutUs";
import FAQ from "./screens/FAQ";
import './App.css'
import Cookies from "js-cookie";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const accessToken = Cookies.get('authToken')
    return accessToken ? children : <Navigate to="/login" replace />
}

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/oauth2/redirect" element={<Login />} />
                <Route
                    element={
                        <PrivateRoute>
                            <Layout />
                        </PrivateRoute>
                    }
                >
                    <Route path="/" element={<Home />} />
                    <Route path="/renting" element={<Renting />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/cars" element={<Cars />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/FAQ" element={<FAQ />} />

                </Route>
            </Routes>

        </BrowserRouter>
    );
};

export default App;