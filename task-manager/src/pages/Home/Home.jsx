import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskTable from "../../components/TaskTable";
import CreateTaskModal from "../../components/TaskModel";
import Header from "../../components/Header";
import Swal from "sweetalert2";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [viewTask, setViewTask] = useState(null); // New state for viewing task details
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://task-management-server-pi-ten.vercel.app/task");
      console.log("Tasks", response.data);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("Failed to load tasks. Please try again later.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle creating or updating a task
  const handleCreateTask = async (newTask) => {
    try {
      if (editTask) {
        const updatedTask = { ...newTask, status: editTask.status };
        const response = await axios.put(
          `https://task-management-server-pi-ten.vercel.app/task/${editTask.id}`,
          updatedTask
        );
        const updatedTasks = tasks.map((task) =>
          task.id === editTask.id ? response.data.task : task
        );
        setTasks(updatedTasks);
        setEditTask(null);
      } else {
        const response = await axios.post(
          "https://task-management-server-pi-ten.vercel.app/task",
          newTask
        );
        fetchTasks();
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskToDelete) => {
    try {
      const token = localStorage.getItem("authToken");

      if (token) {
        await axios.delete(
          `https://task-management-server-pi-ten.vercel.app/task/${taskToDelete._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchTasks();
        Swal.fire({
          title: "Success",
          text: "Task deleted successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Please login first",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete the task. Please try again.");
    }
  };

  // Handle editing a task
  const handleEditTask = (taskToEdit) => {
    setEditTask(taskToEdit);
    setShowModal(true);
  };

  // Handle viewing a task (by id)
  const handleViewTask = async (taskId) => {
    try {
      const response = await axios.get(
        `https://task-management-server-pi-ten.vercel.app/task/${taskId}`
      );
      setViewTask(response.data.task);
    } catch (error) {
      console.error("Error fetching task details:", error);
      alert("Failed to load task details.");
    }
  };

  // Handle status change
  const handleStatusChange = async (task, newStatus) => {
    try {
      const updatedTask = { ...task, status: newStatus };
      const response = await axios.put(
        `https://task-management-server-pi-ten.vercel.app/task/${task._id}`,
        updatedTask
      );
      const updatedTasks = tasks.map((t) =>
        t.id === task._id ? response.data.task : t
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update the task status. Please try again.");
    }
  };

  // Filter tasks based on search query and status
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  let handleCreate = () => {
    if (localStorage?.getItem("authToken")) {
      setShowModal(true);
    } else {
      Swal.fire({
        title: "Error",
        text: "Please login first",
        icon: "error",
      });
    }
  };

  return (
    <div className="">
      <Header />
      <div className="mb-4 p-4 flex items-center justify-between">
        <button
          onClick={handleCreate}
          className="bg-indigo-500 text-white px-4 py-2 rounded-md"
        >
          Create Task
        </button>
        <div className="flex gap-4 items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-4 py-2 rounded-md"
          >
            <option value="All">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-4 py-2 rounded-md"
          />
        </div>
      </div>

      {showModal && (
        <CreateTaskModal
          onClose={() => {
            setShowModal(false);
            setEditTask(null);
          }}
          onSubmit={handleCreateTask}
          initialData={editTask}
        />
      )}

      {viewTask && (
        <div className="task-details-modal">
          <div className="modal-content">
            <h2>Task Details</h2>
            <p><strong>Title:</strong> {viewTask.title}</p>
            <p><strong>Description:</strong> {viewTask.description}</p>
            <p><strong>Status:</strong> {viewTask.status}</p>
            <p><strong>Due Date:</strong> {viewTask.dueDate}</p>
            <button onClick={() => setViewTask(null)} className="close-modal">Close</button>
          </div>
        </div>
      )}

      <TaskTable
        tasks={filteredTasks}
        onDelete={handleDeleteTask}
        onEdit={handleEditTask}
        onView={handleViewTask} // Passing the view handler to TaskTable
      />
    </div>
  );
};

export default Home;
