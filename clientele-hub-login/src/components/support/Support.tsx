import React, { useEffect, useState } from 'react';
import TicketDetailModal from './TicketDetailsModal.tsx';
import CreateTicketModal from './CreateTicketModal.tsx';
import './Support.css';

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
  responses: Response[];
  feedback?: Feedback;
}

const Support = () => {
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [selectedTicket, setSelectedTicket] = useState(null as Ticket | null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadTickets = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const res = await fetch('https://clientele-hub.onrender.com/user/support/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) return;
      setTickets(data as Ticket[]);
    } catch (e) {}
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const updateTicket = async (updatedTicket: Ticket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
  };

  const addTicket = async (input: { subject: string; description: string; attachment: string | null; }) => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    const res = await fetch('https://clientele-hub.onrender.com/user/support/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(input)
    });
    if (!res.ok) return;
    await loadTickets();
  };

  return (
    <div className="support-container">
      <div className="support-header">
        <h2>Support Tickets</h2>
        <button onClick={() => setShowCreateModal(true)}>Create Ticket</button>
      </div>

      <table className="support-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Updated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.subject}</td>
              <td><span className={`status ${ticket.status}`}>{ticket.status}</span></td>
              <td>{ticket.updatedAt}</td>
              <td><button onClick={() => setSelectedTicket(ticket)}>👁 View</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={async (ticket) => {
            // decide whether it's response or feedback based on diffs
            const token = localStorage.getItem('userToken');
            if (!token) return;
            if ((ticket.responses?.length || 0) > (selectedTicket.responses?.length || 0)){
              const newMsg = ticket.responses[ticket.responses.length - 1]?.message;
              if (newMsg){
                const res = await fetch(`https://clientele-hub.onrender.com/user/support/tickets/${ticket.id}/respond`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ message: newMsg })
                });
                if (!res.ok) return;
                const updated = await res.json();
                updateTicket(updated as Ticket);
                await loadTickets();
                return;
              }
            }
            if (ticket.feedback && (ticket.feedback.rating !== (selectedTicket.feedback?.rating||0) || ticket.feedback.comment !== (selectedTicket.feedback?.comment||''))){
              const res = await fetch(`https://clientele-hub.onrender.com/user/support/tickets/${ticket.id}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ rating: ticket.feedback.rating, comment: ticket.feedback.comment, close: ticket.status === 'Closed' })
              });
              if (!res.ok) return;
              const updated = await res.json();
              updateTicket(updated as Ticket);
              await loadTickets();
              return;
            }
            updateTicket(ticket);
          }}
        />
      )}

      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={addTicket}
        />
      )}
    </div>
  );
};

export default Support;
