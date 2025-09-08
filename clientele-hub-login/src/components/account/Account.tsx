import React, { useRef, useState, useEffect } from 'react';
import './Account.css';

const Account = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null as string | null);

  const fileInputRef = useRef(null as HTMLInputElement | null);

  const loadProfile = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) return;
      setName(data.name || '');
      setEmail(data.email || '');
      setCompany(data.company || '');
      setPhone(data.phone || '');
    } catch (e) {}
  };

  useEffect(() => {
    loadProfile();
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
        localStorage.setItem('profileImage', imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, company, phone,email })
      });
      if (!res.ok) return;
      alert('Profile updated successfully!');
    } catch (e) {}
  };

  const handlePasswordUpdate = async () => {
    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }

    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || 'Failed to update password');
        return;
      }
      alert('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      alert('Something went wrong');
    }
  };

  return (
    <div className="account-container">
      <h1 className="account-heading">Account Information</h1>
      <p className="account-subheading">View and manage your personal details.</p>

      {/* Profile Picture Section */}
      <div className="account-section">
        <h2>Profile Picture</h2>
        <p className="section-desc">A picture helps people recognize you.</p>
        <div className="profile-picture-container">
          <div className="avatar-placeholder">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-img" />
            ) : (
              '👤'
            )}
          </div>
          <div>
            <p>Upload a new photo. We recommend a 200x200px image.</p>
            <button className="change-btn" onClick={handleChangePictureClick}>📁 Change Picture</button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Personal Profile */}
      <div className="account-section">
        <h2>Personal Profile</h2>
        <p className="section-desc">This information is used to identify you and for billing.</p>
        <div className="account-form-group">
          <label htmlFor="name">Full Name</label>
          <input id="name" type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="account-form-group">
          <label htmlFor="email">Email Address</label>
          <input id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="account-form-group">
          <label htmlFor="company">Company</label>
          <input id="company" type="text" placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} />
        </div>

        <div className="account-form-group">
          <label htmlFor="phone">Phone</label>
          <input id="phone" type="text" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>

        <button className="save-btn" onClick={handleSaveProfile}>Save Changes</button>
      </div>

      {/* Security Section */}
      <div className="account-section">
        <h2>Security</h2>
        <p className="section-desc">Manage your password and security settings.</p>

        <div className="account-form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="account-form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>

        <div className="account-form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>

        <button className="update-btn" onClick={handlePasswordUpdate}>Update Password</button>
      </div>
    </div>
  );
};

export default Account;
