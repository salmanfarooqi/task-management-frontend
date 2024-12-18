import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/Signup/Signup";

const App = () => {

  const route = createBrowserRouter([
    {
      path: '/',
      element: <Home />

    },
    {
      path: '/login',
      element: <Login/>

    },
    {
      path: '/signup',
      element: <Signup />

    }
  ])
  return (


    <RouterProvider router={route} />
  );
};

export default App;
