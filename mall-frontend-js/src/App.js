import React from "react";
import {createBrowserRouter, BrowserRouter} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import AllGoods from "./pages/AllGoods";
import About from "./pages/About";
import ErrorPage from "./components/Error";
import GoodsDetail from "./pages/GoodsDetail";
import UserIcon from "./components/UserIcon";
import Login from "./pages/Login";
import MyForm from "./pages/Test";
import {postAccessToken} from "./configs/services";



const router = createBrowserRouter([
    {
        path:"/",
        element: <MainLayout/>,
        errorElement: <ErrorPage/>,
        // loader: rootLoader,
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

// const App = () => {
//     return (
//         <div>
//             <BrowserRouter>
//
//             </BrowserRouter>
//         </div>
//     )
// }


export default router;
