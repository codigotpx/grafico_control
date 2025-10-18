import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Layout from './pages/Layout.jsx';
import EnterData from './pages/EnterData.jsx';
import { DataProvider } from './context/DataContext.jsx';
import Graphics from './pages/Graphics.jsx';
import AIAnalysisTest from './pages/AIAnalysisTest.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "graphics", element: <Graphics /> },
      { path: "enterData", element: <EnterData/> },
      { path: "aiAnalysisTest", element: <AIAnalysisTest/> },
    ],
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  </StrictMode>,
)
