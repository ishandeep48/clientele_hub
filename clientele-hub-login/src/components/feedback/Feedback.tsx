import React, { useEffect, useState } from 'react';
import './Feedback.css';

interface FeedbackItem {
  id: string;
  message: string;
  rating: number;
  tag: string;
  createdAt: string;
}

const Feedback = () => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(3);
  const [tag, setTag] = useState('Suggestion');
  const [feedbackList, setFeedbackList] = useState([] as FeedbackItem[]);

  const loadFeedback = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/user/feedback', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) return;
      setFeedbackList(data as FeedbackItem[]);
    } catch (e) {}
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleSubmit = async () => {
    if (message.trim() === '') return;
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/user/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message, rating, tag })
      });
      if (!res.ok) return;
      setMessage('');
      setRating(3);
      setTag('Suggestion');
      await loadFeedback();
    } catch (e) {}
  };

  return (
    <div className="feedback-container">
      <h2>Feedback & Reviews</h2>
      <p>Let us know what you think and get instant support.</p>

      <div className="feedback-sections">
        <div className="left-section">
          <h3>Share Your Experience</h3>
          <p>Your feedback helps us improve our products and services.</p>
          <div className="feedback-rating">
            <label>Rating:</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value={1}>1 - Poor</option>
              <option value={2}>2 - Fair</option>
              <option value={3}>3 - Good</option>
              <option value={4}>4 - Very Good</option>
              <option value={5}>5 - Excellent</option>
            </select>
          </div>

          <div className="feedback-tag">
            <label>Category:</label>
            <select value={tag} onChange={(e) => setTag(e.target.value)}>
              <option value="Suggestion">Suggestion</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Complaint">Complaint</option>
              <option value="Praise">Praise</option>
              <option value="Question">Question</option>
            </select>
          </div>
          <textarea
            placeholder="Tell us about your experience, or ask a question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSubmit}>Submit Feedback & Get Help</button>
        </div>

        <div className="right-section">
          <h3>Feedback History</h3>
          <p>Review your past submissions and our suggestions.</p>
          {feedbackList.length === 0 ? (
            <p>You haven't submitted any feedback yet.</p>
          ) : (
            <ul>
              {feedbackList.map((item) => (
                <li key={item.id}>
                  <div className="feedback-item">
                    <div className="feedback-header">
                      <span className="feedback-rating">⭐ {item.rating}/5</span>
                      <span className="feedback-tag">{item.tag}</span>
                    </div>
                    <div className="feedback-message">{item.message}</div>
                    <small>{item.createdAt}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
