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

const Support: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('supportTickets');
    if (stored) {
      setTickets(JSON.parse(stored));
    } else {
      const dummyTickets: Ticket[] = [
        {
          id: 'TKT-2024-001',
          subject: 'Website is loading slowly',
          description: 'Our main website has been experiencing significant performance degradation over the last 48 hours. Pages are taking upwards of 10 seconds to load.',
          status: 'Open',
          updatedAt: '2024-07-18',
          responses: [
            {
              from: 'Support Team',
              message: 'Thank you for reaching out. We are investigating the issue and will provide an update shortly.',
              time: '7/18/2024, 3:30:00 PM',
            },
          ],
        }
      ];
      localStorage.setItem('supportTickets', JSON.stringify(dummyTickets));
      setTickets(dummyTickets);
    }
  }, []);

  const updateTicket = (updatedTicket: Ticket) => {
    const updatedTickets = tickets.map(ticket =>
      ticket.id === updatedTicket.id ? updatedTicket : ticket
    );
    setTickets(updatedTickets);
    localStorage.setItem('supportTickets', JSON.stringify(updatedTickets));
    setSelectedTicket(updatedTicket);
  };

  const addTicket = (newTicket: Ticket) => {
    const updated = [newTicket, ...tickets];
    setTickets(updated);
    localStorage.setItem('supportTickets', JSON.stringify(updated));
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
              <td><span className={`status ${ticket.status.toLowerCase()}`}>{ticket.status}</span></td>
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
          onUpdate={updateTicket}
        />
      )}

      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          onCreate={addTicket}
        />
      )}
    </div>
  );
};

export default Support;
