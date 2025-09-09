import React, { useState } from 'react';
import axios from 'axios';
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

const Chatbot = () => {
  const [messages, setMessages] = useState([] as Message[]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    try{
      const botText = await getBotResponse(input);
      const botMsg: Message = { sender: 'bot', text: botText };
      setMessages((prev) => [...prev, botMsg]);
    }catch(e){
      const botMsg: Message = { sender: 'bot', text: 'Sorry, something went wrong.' };
      setMessages((prev) => [...prev, botMsg]);
    }
    setInput('');
  };

  const getBotResponse = async (query: string): Promise<string> => {
    const q = query.toLowerCase();
    const token = localStorage.getItem('userToken');
    if(!token){
      return 'Please log in to view your account information.';
    }

    // ORDER-RELATED QUERIES
    if (q.includes('order') && q.includes('status')) {
      try{
        const res = await axios.get('http://localhost:5000/user/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const orders = Array.isArray(res.data) ? res.data : [];
        if (orders.length === 0) return 'You have no orders currently.';
        return orders.map((o: any) => `Order #${o.id} - ${o.status} - ₹${o.total} (${o.date})`).join('\n');
      }catch(err){
        return 'Could not fetch your orders right now.';
      }
    }

    if (q.includes('total') && q.includes('order')) {
      try{
        const res = await axios.get('http://localhost:5000/user/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const orders = Array.isArray(res.data) ? res.data : [];
        return `You have a total of ${orders.length} orders.`;
      }catch(err){
        return 'Could not fetch your orders right now.';
      }
    }

    if (q.includes('last') && q.includes('order')) {
      try{
        const res = await axios.get('http://localhost:5000/user/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const orders = Array.isArray(res.data) ? res.data : [];
        const last = orders[0];
        return last ? `Your last order is #${last.id} with status ${last.status} for ₹${last.total}` : 'No recent orders found.';
      }catch(err){
        return 'Could not fetch your orders right now.';
      }
    }

    // TICKET-RELATED QUERIES
    if (q.includes('ticket') || q.includes('support') || q.includes('complaint')) {
      try{
        const res = await axios.get('http://localhost:5000/user/support/tickets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const tickets = Array.isArray(res.data) ? res.data : [];
        if (tickets.length === 0) return 'No support tickets found.';
        return tickets.map((t: any) => `#${t.id}: ${t.subject} (${t.status})`).join('\n');
      }catch(err){
        return 'Could not fetch your tickets right now.';
      }
    }

    if (q.includes('open ticket')) {
      try{
        const res = await axios.get('http://localhost:5000/user/support/tickets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const tickets = Array.isArray(res.data) ? res.data : [];
        const openTickets = tickets.filter((t: any) => String(t.status).toLowerCase() === 'open');
        return openTickets.length > 0
          ? openTickets.map((t: any) => `#${t.id}: ${t.subject}`).join('\n')
          : 'No open tickets right now.';
      }catch(err){
        return 'Could not fetch your tickets right now.';
      }
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
