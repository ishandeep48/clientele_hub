import React, { useState, useEffect } from 'react';
import './TicketDetailsModal.css';

interface Response {
  from: string;
  message: string;
  time: string;
}

interface Feedback {
  rating: number;
  comment: string;
}

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  updatedAt: string;
  responses?: Response[]; // optional to avoid undefined error
  feedback?: Feedback;
}

interface Props {
  ticket?: Ticket; // optional to avoid undefined crash
  onClose: () => void;
  onUpdate: (ticket: Ticket) => void;
}

const TicketDetailModal: React.FC<Props> = ({ ticket, onClose, onUpdate }) => {
  const [newMessage, setNewMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // When ticket changes, update feedback states
  useEffect(() => {
    setRating(ticket?.feedback?.rating || 0);
    setComment(ticket?.feedback?.comment || '');
  }, [ticket]);

  const sendResponse = () => {
    if (!newMessage.trim() || !ticket) return;
    const updated: Ticket = {
      ...ticket,
      responses: [
        ...(ticket.responses || []),
        {
          from: 'Client',
          message: newMessage,
          time: new Date().toLocaleString(),
        },
      ],
    };
    onUpdate(updated);
    setNewMessage('');
  };

  const submitFeedback = () => {
    if (!ticket) return;
    const updated: Ticket = {
      ...ticket,
      feedback: { rating, comment },
    };
    onUpdate(updated);
    alert('Feedback submitted!');
  };

  if (!ticket) {
    return (
      <div className="ticket-modal-overlay">
        <div className="ticket-modal">
          <p>Error: Ticket not found.</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-modal-overlay">
      <div className="ticket-modal">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2>Ticket #{ticket.id}</h2>
        <p><strong>Subject:</strong> {ticket.subject}</p>
        <p><strong>Status:</strong> {ticket.status}</p>
        <p><strong>Last Updated:</strong> {ticket.updatedAt}</p>

        <div className="section">
          <h3>Initial Request</h3>
          <p>{ticket.description}</p>
        </div>

        <div className="section">
          <h3>Conversation</h3>
          {(ticket.responses?.length ?? 0) > 0 ? (
            ticket.responses!.map((r, i) => (
              <div key={i} className="message">
                <strong>{r.from}</strong> <span className="timestamp">{r.time}</span>
                <p>{r.message}</p>
              </div>
            ))
          ) : (
            <p className="no-message">No conversation yet.</p>
          )}
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your response..."
          />
          <button onClick={sendResponse}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;
