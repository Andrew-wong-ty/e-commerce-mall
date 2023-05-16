import React from "react";
import {BrowserRouter,Route,Routes} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import AllGoods from "./pages/AllGoods";
import About from "./pages/About";
import ErrorPage from "./components/Error";

function App() {
    return (
    <div>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout/>} errorElement={<ErrorPage/>}>
                    <Route index element={<HomePage/>}/>
                    <Route path="all" element={<AllGoods/>}/>
                    <Route path="about" element={<About/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </div>
    );
}

export default App;
