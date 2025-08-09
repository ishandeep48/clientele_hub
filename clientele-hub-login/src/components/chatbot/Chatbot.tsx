import React, { useState } from 'react';
import './Chatbot.css';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface Order {
  id: string;
  orderId: string;
  product: string;
  status: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { sender: 'user', text: input };
    const botMsg: Message = { sender: 'bot', text: getBotResponse(input) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase();
    const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const tickets: Ticket[] = JSON.parse(localStorage.getItem('tickets') || '[]');

    // ORDER-RELATED QUERIES
    if (q.includes('order') && q.includes('status')) {
      if (orders.length === 0) return 'You have no orders currently.';
      return orders.map(o => `${o.product} (ID: ${o.orderId}) - ${o.status}`).join('\n');
    }

    if (q.includes('total') && q.includes('order')) {
      return `You have a total of ${orders.length} orders.`;
    }

    if (q.includes('last') && q.includes('order')) {
      const last = orders[orders.length - 1];
      return last ? `Your last order was ${last.product} with status ${last.status}` : 'No recent orders found.';
    }

    // TICKET-RELATED QUERIES
    if (q.includes('ticket') || q.includes('support') || q.includes('complaint')) {
      if (tickets.length === 0) return 'No support tickets found.';
      return tickets.map(t => `#${t.id}: ${t.subject} (${t.status})`).join('\n');
    }

    if (q.includes('open ticket')) {
      const openTickets = tickets.filter(t => t.status.toLowerCase() === 'open');
      return openTickets.length > 0
        ? openTickets.map(t => `#${t.id}: ${t.subject}`).join('\n')
        : 'No open tickets right now.';
    }

    return "I can help you with orders or support tickets. Try asking 'What is the status of my order?' or 'Show my open tickets.'";
  };

  return (
    <div className="chatbot-wrapper">
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <span>Client Assistant</span>
            <button onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="chatbot-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-footer">
            <input
              type="text"
              value={input}
              placeholder="Ask me something..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
      {!open && (
        <button className="chatbot-toggle" onClick={() => setOpen(true)}>
          💬
        </button>
      )}
    </div>
  );
};

export default Chatbot;
