import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import router from './App';
import {RouterProvider} from "react-router-dom";
import store from './store/store'
import { Provider } from 'react-redux'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider store={store}>
          <RouterProvider router={router}/>
      </Provider>
  </React.StrictMode>
);

/*
前台商城：http://xmall.exrick.cn/
后台管理系统：http://xmadmin.exrick.cn/
 */
