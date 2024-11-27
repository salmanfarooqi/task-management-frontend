import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



const Header = ({  }) => {
  const navigate = useNavigate();
   const[ isLoggedIn,setIsLoggedIn]=useState(false)

  console.log(localStorage?.getItem('authToken'))

  useEffect(()=>{
 if(localStorage?.getItem('authToken')){
    setIsLoggedIn(true)
 }
  },[])

  const  handleLogout=()=>{
    localStorage?.setItem('authToken','')
    setIsLoggedIn(false)
  }
  return (
    <header className="bg-indigo-500 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Logo Section */}
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Task Manager
      </div>


      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Welcome to our task Manger system
      </div>
      {/* Navigation Links */}
      <nav className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/")}
          className="hover:bg-indigo-700 text-xl px-4 py-2 rounded-md transition"
        >
          Home
        </button>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition"
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
