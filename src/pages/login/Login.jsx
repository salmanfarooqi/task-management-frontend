import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { HiEye, HiEyeOff } from "react-icons/hi";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Yup validation schema
const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  
  const handleLogin = async (data) => {
    setIsLoading(true); 

    try {
      const response = await axios.post(
        "https://task-management-server-pi-ten.vercel.app/user/login",
        data
      );

      Swal.fire({
        title: "Success",
        text: "Login successful!",
        icon: "success",
        confirmButtonText: "OK",
      });



      console.log("....",response.token)

      localStorage.setItem('authToken',response.data.token)
      navigate("/");
    } catch (error) {
     
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Login failed!",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-[400px] bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Login</h2>

        <form className="mt-6" onSubmit={handleSubmit(handleLogin)}>
      
          <div className="mb-4">
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Enter your email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

        
          <div className="mb-4 relative">
            <label className="block text-gray-600">Password</label>
            <input
              type={passwordVisible ? "text" : "password"}
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Enter your password"
              {...register("password")}
            />
            <div
              className="absolute right-4 top-1/2 mt-4 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

      
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>

  
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-indigo-500 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
