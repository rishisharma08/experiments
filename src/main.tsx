import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createHashRouter, type RouteObject } from "react-router";
import routes from './routeConfig.tsx';
import './index.css';

const router = createHashRouter(
  routes as RouteObject[],
  {
    // basename: import.meta.env.BASE_URL //not needed for hash router but needed for browser router
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
