import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './Leads.css';
// import LeadsChart from '../dashboard/charts/LeadsChart.tsx';

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  source: string;
  createdAt: string;
}

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState<Omit<Lead, 'id'>>({
    name: '',
    email: '',
    company: '',
    source: '',
    createdAt: '',
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const savedLeads = localStorage.getItem('leads');
    if (savedLeads) setLeads(JSON.parse(savedLeads));
  }, []);

  useEffect(() => {
    localStorage.setItem('leads', JSON.stringify(leads));
  }, [leads]);

  const handleSaveLead = () => {
    const currentDate = new Date().toLocaleDateString();
    if (editId) {
      setLeads(prev =>
        prev.map(lead =>
          lead.id === editId ? { ...lead, ...newLead } : lead
        )
      );
    } else {
      const newEntry = {
        id: Date.now().toString(),
        ...newLead,
        createdAt: currentDate,
      };
      setLeads(prev => [...prev, newEntry]);
    }

    setNewLead({ name: '', email: '', company: '', source: '', createdAt: '' });
    setIsModalOpen(false);
    setEditId(null);
  };

  const handleEdit = (lead: Lead) => {
    setEditId(lead.id);
    setNewLead({ ...lead });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const confirm = window.confirm('Delete this lead?');
    if (confirm) {
      setLeads(prev => prev.filter(lead => lead.id !== id));
      setSelectedLeads(prev => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    }
  };

  const handleConvert = (id: string) => {
    const leadToConvert = leads.find(lead => lead.id === id);
    if (!leadToConvert) return;

    const newCustomer = {
      id: `cust-${Date.now()}`,
      name: leadToConvert.name,
      email: leadToConvert.email,
      company: leadToConvert.company,
      source: leadToConvert.source,
      joinedDate: new Date().toLocaleDateString(),
    };

    const existingCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    const updatedCustomers = [...existingCustomers, newCustomer];
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));

    alert(`Lead ${leadToConvert.name} has been converted to a customer.`);
  };

  const handleBulkConvert = () => {
    const selected = leads.filter(lead => selectedLeads.has(lead.id));
    if (selected.length === 0) return alert("Select at least one lead to convert.");

    const existingCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    const newCustomers = selected.map(lead => ({
      id: `cust-${Date.now()}-${Math.random()}`,
      name: lead.name,
      email: lead.email,
      company: lead.company,
      source: lead.source,
      joinedDate: new Date().toLocaleDateString(),
    }));
    localStorage.setItem('customers', JSON.stringify([...existingCustomers, ...newCustomers]));

    alert(`${selected.length} lead(s) converted to customers.`);
    setSelectedLeads(new Set());
  };

  const handleSelectLead = (id: string) => {
    setSelectedLeads(prev => {
      const updated = new Set(prev);
      if (updated.has(id)) updated.delete(id);
      else updated.add(id);
      return updated;
    });
  };

  const handleSelectAll = () => {
    if (selectedLeads.size === leads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(leads.map(lead => lead.id)));
    }
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const importedLeads: Lead[] = results.data.map((row: any) => ({
          id: Date.now().toString() + Math.random(),
          name: row.name,
          email: row.email,
          company: row.company,
          source: row.source,
          createdAt: new Date().toLocaleDateString(),
        }));
        setLeads(prev => [...prev, ...importedLeads]);
      },
    });
  };

  return (
    <div className="leads-container">
      <div className="leads-header">
        <div>
          <h2>Leads</h2>
          <p>Track and manage your prospects.</p>
        </div>
        <div className="action-buttons">
          <label className="import-btn">
            Import Leads
            <input type="file" accept=".csv" onChange={handleImportCSV} hidden />
          </label>
          <button className="add-lead-btn" onClick={() => setIsModalOpen(true)}>Add New Lead</button>
          <button className="convert-btn" onClick={handleBulkConvert}>Convert to Customer</button>
        </div>
      </div>

      <table className="leads-table">
        <thead>
          <tr>
            <th>Name & Email</th>
            <th>Company</th>
            <th>Source</th>
            <th>Created</th>
            <th>Actions</th>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedLeads.size === leads.length && leads.length > 0}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>
                <strong>{lead.name}</strong>
                <div className="email">{lead.email}</div>
              </td>
              <td>{lead.company}</td>
              <td>{lead.source}</td>
              <td>{lead.createdAt}</td>
              <td>
                <div className="menu">
                  <button className="dots-btn">⋮</button>
                  <div className="dropdown">
                    <button onClick={() => handleEdit(lead)}>Edit</button>
                    <button onClick={() => handleDelete(lead.id)}>Delete</button>
                  </div>
                </div>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedLeads.has(lead.id)}
                  onChange={() => handleSelectLead(lead.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="lead-modal">
            <h3>{editId ? 'Edit Lead' : 'New Lead'}</h3>
            <input
              type="text"
              placeholder="Name"
              value={newLead.name}
              onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newLead.email}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Company"
              value={newLead.company}
              onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
            />
            <input
              type="text"
              placeholder="Source"
              value={newLead.source}
              onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={handleSaveLead}>{editId ? 'Update' : 'Add'} Lead</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
