import React, { useState } from "react";

const TaskTable = ({
  tasks,
  onEdit,
  onDelete,
  onView,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Function to handle opening the modal
  const handleViewClick = (task) => {
    setSelectedTask(task);
    setViewModalOpen(true);
    onView(task); // Trigger the view action passed as a prop
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setViewModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Task List</h2>
      
      <table className="w-full  table-auto border-collapse shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr className="text-gray-700">
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">Description</th>
            <th className="py-3 px-4 text-left">Due Date</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600">
          {tasks?.length > 0 ? (
            tasks.map((task, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{task.title}</td>
                <td className="py-3 px-4">{task.description}</td>
                <td className="py-3 px-4">{task.dueDate}</td>
                <td className="py-3 px-4">{task.status || "Pending"}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleViewClick(task)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(task)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(task)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                No tasks available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 transition"
        >
          &lt; Previous
        </button>

        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 transition"
        >
          Next &gt;
        </button>
      </div>

  
      {viewModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-96">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Task Details</h2>
            <p className="mb-3">
              <strong>Title:</strong> {selectedTask.title}
            </p>
            <p className="mb-3">
              <strong>Description:</strong> {selectedTask.description}
            </p>
            <p className="mb-3">
              <strong>Due Date:</strong> {selectedTask.dueDate}
            </p>
            <p className="mb-3">
              <strong>Status:</strong> {selectedTask.status || "Pending"}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
