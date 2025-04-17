import React, { JSX } from 'react'
import { BrowserRouter, Routes, Route, Navigate  } from "react-router";
import Layout from './layout.tsx';
import Login from './screens/Login';
import Home from './screens/Home';
import Register from "./screens/Register";
import './App.css'

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const accessToken = "test"  // powinno byc: Cookies.get('accessToken') ale jesli nie chcemy wejsc do home to zmien "test" na null
    return accessToken ? children : <Navigate to="/login" replace />
}

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    element={
                        <PrivateRoute>
                            <Layout />
                        </PrivateRoute>
                    }
                >
                    <Route path="/" element={<Home />} />

                </Route>
            </Routes>

        </BrowserRouter>
    );
};

export default App;