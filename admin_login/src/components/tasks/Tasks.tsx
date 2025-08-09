// src/components/tasks/Tasks.tsx
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "./Tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("admin_tasks") || "[]");
    setTasks(storedTasks);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const isSameDate = (taskDate: string, selected: Date | null) => {
    if (!selected) return true;
    const task = new Date(taskDate);
    return task.toDateString() === selected.toDateString();
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h2>Task Manager</h2>
      </div>

      <div className="calendar-task-layout">
        <div className="calendar-wrapper">
          <Calendar
            onChange={(date) => setSelectedDate(date as Date)}
            value={selectedDate}
          />
        </div>

        <div className="task-table-container">
          <table className="task-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Assigned User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={7}>No tasks found.</td>
                </tr>
              ) : (
                tasks
                  .filter((task: any) =>
                    isSameDate(task.dueDate, selectedDate)
                  )
                  .map((task: any, idx: number) => (
                    <tr key={idx}>
                      <td>{task.title}</td>
                      <td>{task.customer}</td>
                      <td>
                        <span className={`status-badge ${task.status.toLowerCase()}`}>
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td>{formatDate(task.dueDate)}</td>
                      <td>{task.assignedUser}</td>
                      <td>
                        <button>Edit</button>
                        <button>Delete</button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
