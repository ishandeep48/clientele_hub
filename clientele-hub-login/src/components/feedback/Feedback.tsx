import React, { useEffect, useState } from 'react';
import './Feedback.css';

const Feedback: React.FC = () => {
  const [message, setMessage] = useState('');
  const [feedbackList, setFeedbackList] = useState<string[]>([]);

  // Load feedback from localStorage
  useEffect(() => {
    const storedFeedback = localStorage.getItem('clientele_feedback');
    if (storedFeedback) {
      setFeedbackList(JSON.parse(storedFeedback));
    }
  }, []);

  const handleSubmit = () => {
    if (message.trim() === '') return;

    const updatedList = [message, ...feedbackList];
    localStorage.setItem('clientele_feedback', JSON.stringify(updatedList));
    setFeedbackList(updatedList);
    setMessage('');
  };

  return (
    <div className="feedback-container">
      <h2>Feedback & Reviews</h2>
      <p>Let us know what you think and get instant support.</p>

      <div className="feedback-sections">
        <div className="left-section">
          <h3>Share Your Experience</h3>
          <p>Your feedback helps us improve our products and services.</p>
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
              {feedbackList.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
