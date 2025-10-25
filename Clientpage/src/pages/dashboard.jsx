import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:4000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  //  Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session has expired, Login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  //Fetch user profile (optional)
  const fetchUser = async () => {
    try {
      const res = await api.get("/authority/me"); // Ensure you have this route on backend
      setUser(res.data.username || "User");
    } catch {
      setUser("User");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Title isrequired");
    await api.post("/tasks", form);
    setForm({ title: "", description: "" });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchTasks();
    fetchUser();
  }, []);

const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="dashboard-container">
      {/* Floating Navbar */}
      <div className="navbar">
        <div className="nav-left">
          <h3> Personal Tasks Manager</h3>
        </div>
        <div className="nav-right">
          
          <button className="logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="dashboard">
        <div className="header">
          <h2>To Do Tasks</h2>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <input
            name="title"
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button className="submit" type="submit">Add</button>
        </form>

        <ul className="task-list">
          {tasks.length === 0 && <p>No tasks Add </p>}
          {tasks.map((t) => (
            <li key={t._id} className="task-item">
              <div>
                <strong>{t.title}</strong>
                <p>{t.description}</p>
              </div>
              <button onClick={() => handleDelete(t._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;