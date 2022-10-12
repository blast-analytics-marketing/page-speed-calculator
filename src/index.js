import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './components/Home/Home';
import Error from './components/Error/Error';
import Results from './components/Results/Results';
import Questions from './components/Questions/Questions';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
    errorElement: <Error/>
  },
  {
    path: "/results",
    element: <Results/>,
  },
  {
    path: "/questions",
    element: <Questions/>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
