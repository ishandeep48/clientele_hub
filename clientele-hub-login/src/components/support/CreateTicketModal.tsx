import React, { useState } from 'react';
import './CreateTicketModal.css';

interface Props {
  onClose: () => void;
  onSubmit: (ticket: {
    subject: string;
    description: string;
    attachment: string | null;
  }) => void;
}

const CreateTicketModal = ({ onClose, onSubmit }: Props) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);

  const handleAttachment = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!subject.trim() || !description.trim()) {
      alert('Please fill in both Subject and Description.');
      return;
    }
    onSubmit({ subject, description, attachment });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create a New Support Ticket</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <label>Subject</label>
          <input
            type="text"
            placeholder="Enter subject here"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <label>Description</label>
          <textarea
            placeholder="Describe your issue here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <label>Attachment (optional)</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleAttachment}
          />

          {attachment && (
            <div className="attachment-preview">
              <span>File attached successfully</span>
            </div>
          )}

          <button className="submit-btn" onClick={handleSubmit}>
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketModal;
