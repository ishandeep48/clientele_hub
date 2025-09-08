import React, { useState, useEffect , useLayoutEffect} from "react";
import "./AdminSettings.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {useNavigate} from 'react-router-dom'
const AdminSettings: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [token,setToken] = useState(null)
  const navigate = useNavigate();
  // const activityLogs = [
  //   { id: 1, action: 'Logged in', time: '2025-08-05 09:00 AM' },
  //   { id: 2, action: 'Changed email', time: '2025-08-03 03:23 PM' },
  //   { id: 3, action: 'Updated password', time: '2025-07-30 12:45 PM' }
  // ];
 
  
  // console.log(token.name)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/login");
    } else {
      try {
        const decodedToken = jwtDecode(storedToken);
        setToken(decodedToken);
        const storedAdmin = JSON.parse(localStorage.getItem("admin_user") || "{}");
        setName(decodedToken.name || "Admin User");
        setEmail(decodedToken.mail || "admin@example.com");
        setProfilePic(storedAdmin.profilePic || "");
        setDarkMode(localStorage.getItem("admin_dark_mode") === "true");
      } catch (error) {
        console.error("Failed to decode token:", error);
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // const formData = new FormData();
      // formData.append('name', name);
      // formData.append('email', email);
      // console.log(formData.entries())
      const formData = {
        name,
        email,
        original: token.mail,
      };
      console.log(formData);
      // if (profilePic.startsWith('data:image')) {
      //   const blob = await fetch(profilePic).then(res => res.blob());
      //   formData.append('profile_pic', blob, 'profile.jpg');
      // }
      const response = await axios.post(
        "http://localhost:5000/admin/updatedetails",
        formData
      );

      const result = response.data;
      console.log(result);
      if (result.status) {
        localStorage.setItem("token", result.token);
        const token = jwtDecode(localStorage.getItem("token"));
        setName(token.name || "Admin User");
        setEmail(token.mail || "admin@example.com");
        alert("Profile updated successfully!");
      } else {
        alert(result.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating profile.");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert("Please enter current and new password.");
      return;
    }

    try {
      // const storedAdmin = JSON.parse(localStorage.getItem('admin_user') || '{}');
      const formData = {
        email: token.mail,
        current_pass: currentPassword,
        new_password: newPassword,
      };
      // const response = await fetch('http://localhost:5000/admin/updatepass', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     email: storedAdmin.email,
      //     current_password: currentPassword,
      //     new_password: newPassword
      //   })
      // });
      const response = await axios.post(
        "http://localhost:5000/admin/updatepass",
        formData
      );
      const result = response.data;

      // const result = await response.json();
      if (result.success) {
        alert("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        alert(result.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("An error occurred while changing password.");
    }
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    alert(`Notifications ${!notificationsEnabled ? "enabled" : "disabled"}.`);
  };

  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("admin_dark_mode", String(newMode));
    // alert(`Dark Mode ${newMode ? "Enabled" : "Disabled"}`);
  };

  const handleDeleteAccount = async () => {
    // localStorage.removeItem('admin_user');
    const response = await axios.delete(
      "http://localhost:5000/admin/deleteacc",
      {
        data: {
          email: token.mail,
        },
      }
    );

    const result = response.data;
    if (result.success) {
      alert("Account deleted!");
      setShowDeleteConfirm(false);
      localStorage.clear()
      navigate('/login');
    } else {
      alert("Some Error Occured and we couldnt delete ur acc");
    }
  };
  // console.log("Token is   ",jwtDecode(token))
  return (
    <div className={`settings-page ${darkMode ? "dark" : ""}`}>
      <div className="settings-container">
        <h2>Admin Settings</h2>

        {/* Profile Info */}
        <section>
          <h3>Profile Info</h3>
          <div className="profile-pic-preview">
            {profilePic ? (
              <img src={profilePic} alt="Profile" />
            ) : (
              <div className="placeholder">No Image</div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicUpload}
            />
          </div>
          <div className="form-group">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button className="save-btn" onClick={handleSaveProfile}>
            Save Profile
          </button>
        </section>

        {/* Password Change */}
        <section>
          <h3>Change Password</h3>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button className="save-btn" onClick={handleChangePassword}>
            Update Password
          </button>
        </section>

        {/* Toggles */}
        <section>
          <h3>Preferences</h3>
          <div className="toggle-group">
            <label>Enable Notifications</label>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={handleToggleNotifications}
            />
          </div>
          <div className="toggle-group">
            <label>Dark Mode</label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={handleDarkModeToggle}
            />
          </div>
        </section>

        {/* Language & Timezone */}
        {/* <section>
          <h3>Locale Settings</h3>
          <div className="form-group">
            <label>Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div className="form-group">
            <label>Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
            </select>
          </div>
        </section> */}

        {/* Activity Logs */}
        {/* <section>
          <h3>Recent Activity</h3>
          <ul className="activity-logs">
            {activityLogs.map(log => (
              <li key={log.id}>
                <span>{log.action}</span>
                <small>{log.time}</small>
              </li>
            ))}
          </ul>
        </section> */}

        {/* Account Delete */}
        <section>
          <h3>Account Actions</h3>
          <button
            className="danger-btn"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </button>
        </section>
      </div>

      {/* Confirm Delete */}
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="modal-content">
            <p>Are you sure you want to delete your admin account?</p>
            <button className="danger-btn" onClick={handleDeleteAccount}>
              Yes, Delete
            </button>
            <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
