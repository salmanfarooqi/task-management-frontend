import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";

const taskSchema = yup.object().shape({
  title: yup.string().required("Title is required").max(50, "Title cannot exceed 50 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  dueDate: yup.date().required("Due Date is required").typeError("Invalid date format"),
  status: yup
    .string()
    .oneOf(["pending", "inprogress", "completed"], "Invalid status")
    .when("$isEdit", (isEdit, schema) => (isEdit ? schema.required("Status is required") : schema)),
});

const CreateTaskModal = ({ onClose, onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(taskSchema, { context: { isEdit: !!initialData } }),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      dueDate: initialData?.dueDate || "",
      status: initialData?.status || "pending",
    },
  });

  const submitHandler = async (data) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No token found");
      }

    
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const url = initialData
        ? `https://task-management-server-pi-ten.vercel.app/task/${initialData._id}`
        : "https://task-management-server-pi-ten.vercel.app/task";

    
      const response = initialData
        ? await axios.put(url, data, { headers })
        : await axios.post(url, data, { headers });

      Swal.fire({
        title: "Success",
        text: `Task ${initialData ? "updated" : "created"} successfully!`,
        icon: "success",
        confirmButtonText: "OK",
      });

      onSubmit(response.data);
      onClose();
      reset();
    } catch (error) {
   
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to create task",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-3/4 lg:w-2/3 mt-4 px-3 py-2 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-6">
          {initialData ? "Edit Task" : "Create Task"}
        </h3>
        <form onSubmit={handleSubmit(submitHandler)}>
    
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Title</label>
            <input
              type="text"
              {...register("title")}
              className={`w-full mt-2 px-4 py-2 border rounded-md ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
          </div>

        
          <div className="mb-6">
            <label className="block text-gray-600 font-medium">Description</label>
            <textarea
              {...register("description")}
              rows="6"
              className={`w-full mt-2 px-4 py-3 border rounded-md ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <span className="text-red-500 text-sm">{errors.description.message}</span>
            )}
          </div>

       
          <div className="mb-3">
            <label className="block text-gray-600 font-medium">Due Date</label>
            <input
              type="date"
              {...register("dueDate")}
              className={`w-full mt-1 px-4 py-1 border rounded-md ${
                errors.dueDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.dueDate && (
              <span className="text-red-500 text-sm">{errors.dueDate.message}</span>
            )}
          </div>

         
          {initialData && (
            <div className="mb-3">
              <label className="block text-gray-600 font-medium">Status</label>
              <select
                {...register("status")}
                className={`w-full mt-1 px-4 py-3 border rounded-md ${
                  errors.status ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              {errors.status && (
                <span className="text-red-500 text-sm">{errors.status.message}</span>
              )}
            </div>
          )}

        
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 bg-gray-300 px-6 py-3 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-500 text-white px-6 py-3 rounded-md hover:bg-indigo-600"
            >
              {initialData ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
