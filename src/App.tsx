import { BrowserRouter, Routes, Route } from "react-router";
import Layout from './layout.tsx';
import Login from './screens/Login';
import Home from './screens/Home';
import Register from "./screens/Register";
import './App.css'


const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={ <Layout />}>
                    <Route path="/" element={<Home />} />
                </Route>
            </Routes>

        </BrowserRouter>
    );
};

export default App;