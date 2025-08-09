import React, { useEffect, useState } from 'react';
import './Feedback.css';

interface Feedback {
  id: string;
  message: string;
  customer: string;
  rating: number;
  tag: 'Suggestion' | 'Issue';
  date: string;
}

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);

  useEffect(() => {
    const storedFeedback = localStorage.getItem('feedbackList');
    if (storedFeedback) {
      setFeedbackList(JSON.parse(storedFeedback));
    }
  }, []);

  return (
    <div className="feedback-container">
      <h2>Feedback</h2>
      <p className="subheading">Review and manage user feedback.</p>

      <div className="feedback-table">
        <div className="feedback-table-header">
          <span>Response</span>
          <span>Customer</span>
          <span>Rating</span>
          <span>Tag</span>
          <span>Date</span>
          <span></span>
        </div>

        {feedbackList.map((fb) => (
          <div className="feedback-table-row" key={fb.id}>
            <span className="feedback-message">{fb.message}</span>
            <span>{fb.customer}</span>
            <span>{renderStars(fb.rating)}</span>
            <span>
              <span className={`tag ${fb.tag.toLowerCase()}`}>{fb.tag}</span>
            </span>
            <span>{fb.date}</span>
            <span className="dots">⋯</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const renderStars = (count: number) => {
  return [...Array(5)].map((_, i) => (
    <span key={i} className={i < count ? 'star filled' : 'star'}>★</span>
  ));
};

export default Feedback;
