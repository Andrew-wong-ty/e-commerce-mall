import React from "react";
import {createBrowserRouter} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import AllGoods from "./pages/AllGoods";
import About from "./pages/About";
import ErrorPage from "./components/Error";
import GoodsDetail from "./pages/GoodsDetail";
import UserIcon from "./components/UserIcon";
import Login from "./pages/Login";
import MyForm from "./pages/Test";

const router = createBrowserRouter([
    {
        path:"/",
        element: <MainLayout/>,
        errorElement: <ErrorPage/>,
        children: [
            {
              index:true,
              element:<HomePage/>,
            },
            {
                path:"all",
                element: <AllGoods/>,
            },
            {
                path:"about",
                element: <About/>,
            },
            {
                path:"details/:detailId",
                element: <GoodsDetail/>,
            },
        ]
    },
    {
        path:"test",
        element: <MyForm/>
    },
    {
        path:"login",
        element: <Login/>
    }

])


export default router;
