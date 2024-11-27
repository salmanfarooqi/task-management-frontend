import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { HiEye, HiEyeOff } from "react-icons/hi";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"


const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Signup = () => {
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

  const handleSignup = async (data) => {
    console.log("Handle Signup called with data:", data); 
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://task-management-server-pi-ten.vercel.app/user/register",
        data
      );


      Swal.fire({
        title: "Success",
        text: "You have signed up successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      console.log("Signed up", response.data);

      navigate("/login");

    } catch (error) {
    
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Signup failed!",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="min-w-[36%] p-2 md:p-8 border rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit(handleSignup)}>
        
          <div className="mb-4">
            <input
              type="text"
              placeholder="Name"
              className="border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("name")}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

  
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

  
          <div className="mb-4 relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("password")}
            />
            <div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>


          <button
            type="submit"
            className="bg-indigo-500 text-white rounded-md px-4 py-2 w-full disabled:opacity-50"
            disabled={isLoading} 
          >
            {isLoading ? (
              <div className="loader">Loading...</div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

   
        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-500 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
