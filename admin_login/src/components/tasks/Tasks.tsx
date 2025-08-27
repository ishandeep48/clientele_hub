// src/components/tasks/Tasks.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "./Tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOriginal, setEditingOriginal] = useState<any | null>(null);
  const [form, setForm] = useState<any>({
    title: '',
    customer: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '',
    assignedUser: ''
  });

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('http://localhost:5000/admin/tasks/all');
        const data = Array.isArray(res.data) ? res.data : [];
        setTasks(data);
      } catch (e) {
        console.error('Failed to fetch tasks', e);
        setError('Failed to fetch tasks');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
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

  const STATUSES = ['Pending','In Progress','Completed','Cancelled'];
  const PRIORITIES = ['Low','Medium','High','Critical'];
  const toInputDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const deleteTask = async (task: any) => {
    try{
      await axios.delete('http://localhost:5000/admin/tasks/delete', { data: { title: task.title, dueDate: task.dueDate } });
      // refresh
      const res = await axios.get('http://localhost:5000/admin/tasks/all');
      setTasks(Array.isArray(res.data) ? res.data : []);
    }catch(e){
      console.error('Failed to delete task', e);
      alert('Failed to delete task');
    }
  }

  const openEditModal = (task: any) => {
    setEditingOriginal({ title: task.title, dueDate: task.dueDate });
    setForm({
      title: task.title,
      customer: task.customer,
      status: STATUSES.includes(task.status) ? task.status : 'Pending',
      priority: PRIORITIES.includes(task.priority) ? task.priority : 'Medium',
      dueDate: toInputDate(task.dueDate),
      assignedUser: task.assignedUser,
    });
    setIsModalOpen(true);
  };

  const saveEdit = async () => {
    try{
      await axios.put('http://localhost:5000/admin/tasks/update', {
        filter: { title: editingOriginal.title, dueDate: editingOriginal.dueDate },
        update: {
          title: form.title,
          customer: form.customer,
          status: form.status,
          priority: form.priority,
          assignedUser: form.assignedUser,
          dueDate: form.dueDate,
        }
      });
      const res = await axios.get('http://localhost:5000/admin/tasks/all');
      setTasks(Array.isArray(res.data) ? res.data : []);
      setIsModalOpen(false);
      setEditingOriginal(null);
    }catch(e){
      console.error('Failed to update task', e);
      alert('Failed to update task');
    }
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
          {loading && (<div style={{ padding: '1rem', color: '#6b7280' }}>Loading tasks...</div>)}
          {error && (<div style={{ padding: '1rem', color: '#dc2626' }}>{error}</div>)}
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
                        <button onClick={()=>openEditModal(task)}>Edit</button>
                        <button onClick={()=>deleteTask(task)}>Delete</button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0 as any, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 20, width: 500, maxWidth: '90%' }}>
            <h3 style={{ marginTop: 0 }}>Edit Task</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <label style={{ display: 'grid', gap: 6 }}>
                <span>Title</span>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </label>
              <label style={{ display: 'grid', gap: 6 }}>
                <span>Customer</span>
                <input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} />
              </label>
              <label style={{ display: 'grid', gap: 6 }}>
                <span>Status</span>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label style={{ display: 'grid', gap: 6 }}>
                <span>Priority</span>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label style={{ display: 'grid', gap: 6 }}>
                <span>Due Date</span>
                <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              </label>
              <label style={{ display: 'grid', gap: 6 }}>
                <span>Assigned User</span>
                <input value={form.assignedUser} onChange={(e) => setForm({ ...form, assignedUser: e.target.value })} />
              </label>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
              <button onClick={() => { setIsModalOpen(false); setEditingOriginal(null); }}>Cancel</button>
              <button onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
