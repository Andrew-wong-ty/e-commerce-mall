import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import router from './App';
import {RouterProvider} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>
);

/*
前台商城：http://xmall.exrick.cn/
后台管理系统：http://xmadmin.exrick.cn/
 */
