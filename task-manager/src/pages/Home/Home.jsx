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
  const [viewTask, setViewTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://task-management-server-pi-ten.vercel.app/task");
      console.log("Tasks", response.data);
      setTasks(response.data.tasks);
      console.log("fetch ir reloaded");
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("Failed to load tasks. Please try again later.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (newTask) => {
    try {
      const token = localStorage.getItem("authToken");

      if (editTask) {
        const { title, description, status, dueDate } = newTask;

        await axios.put(
          `https://task-management-server-pi-ten.vercel.app/tass/${editTask._id}`,
          {
            title,
            description,
            status: editTask.status || status,
            dueDate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await fetchTasks();
        setEditTask(null);
      } else {
        const { title, description, dueDate } = newTask;

        await axios.post(
          "https://task-management-server-pi-ten.vercel.app/task",
          {
            title,
            description,
            dueDate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await fetchTasks();
        setShowModal(false);
      }
    } catch (error) {
      await fetchTasks();
      console.error("Error saving task:", error);
    }
  };

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
        await fetchTasks();
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

  const handleEditTask = (taskToEdit) => {
    setEditTask(taskToEdit);
    setShowModal(true);
  };

 
  const handleViewTask = async (taskId) => {
    try {
      const response = await axios.get(
        `https://task-management-server-pi-ten.vercel.app/task/${taskId}`
      );
      setViewTask(response.data.task);
    } catch (error) {
      console.error("Error fetching task details:", error);
      
    }
  };


 


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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mb-4 p-4 md:flex md:items-center md:justify-between">
        <button
          onClick={handleCreate}
          className="bg-indigo-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
        >
          Create Task
        </button>
        <div className="flex gap-4 items-center mt-4 md:mt-0 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-4 py-2 rounded-md w-full md:w-auto"
          >
            <option value="All">All</option>
            <option value="pending">Pending</option>
            <option value="inprogress">in progres</option>
            <option value="completed">Completed</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-4 py-2 rounded-md w-full md:w-auto"
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
            <button onClick={() => setViewTask(null)} className="close-modal">
              Close
            </button>
          </div>
        </div>
      )}

      <TaskTable
        tasks={filteredTasks}
        onDelete={handleDeleteTask}
        onEdit={handleEditTask}
        onView={handleViewTask}
      />
    </div>
  );
};

export default Home;
