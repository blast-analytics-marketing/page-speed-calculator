import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Error from './components/Error/Error';
import Results from './components/Results/Results';
import Questions from './components/Questions/Questions';


import { PrismicProvider } from '@prismicio/react';
import { client } from './cms/prismic';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/results",
    element: <Results />,
    errorElement: <Error/>
  },
  {
    path: "/",
    element: <Questions/>,
    errorElement: <Error/>
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
     <PrismicProvider client={client}>
        <RouterProvider router={router} />
     </PrismicProvider>
  </React.StrictMode>
);
