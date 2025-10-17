import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./Leads.css";
import axios from "axios";
// import LeadsChart from '../dashboard/charts/LeadsChart.tsx';

interface Lead {
  uid: string;
  name: string;
  email: string;
  company: string;
  source: string;
  joinedAt: string;
  phone: string;
}

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState<Omit<Lead, "uid">>({
    name: "",
    email: "",
    company: "",
    source: "",
    joinedAt: "",
    phone: "",
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    // const savedLeads = localStorage.getItem('leads');
    // if (savedLeads) setLeads(JSON.parse(savedLeads));
    const request = async () => {
      try {
        const response = await axios.get(
          "/admin/leads/all"
        );
        setLeads(response.data);
      } catch (e) {
        console.warn("couldn't get any response from backend    -  ", e);
      }
    };
    request();
  }, []);

  useEffect(() => {
    localStorage.setItem("leads", JSON.stringify(leads));
  }, [leads]);

  const handleSaveLead = async () => {
    if (editId) {
      try {
        const res = await axios.post("/admin/leads/new", {
          newLead,
        });
        console.log(res);
        const { message } = res.data;
        console.log(` message is ${message}`);
        if (message == "ok" && editId) {
          setLeads((prev) =>
            prev.map((lead) =>
              lead.uid === editId ? { ...lead, ...newLead } : lead
            )
          );
          setIsModalOpen(false);
        } 
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const res = await axios.post("/admin/leads/new", {
          newLead,
        });
        const { message } = res.data;
        if (message == "ok" && !editId) {
          window.location.reload();
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditId(lead.uid);
    setNewLead({ ...lead });
    setIsModalOpen(true);
  };

  const handleDelete = async(uid: string) => {
    const confirm = window.confirm("Delete this lead?");
    if (confirm) {
      // console.log(uid);
      try{
        const res =  await axios.post(' /admin/leads/delete',{uid});
        if(res.data.message=="done"){
          setLeads((prev) => prev.filter((lead) => lead.uid !== uid));
      setSelectedLeads((prev) => {
        const updated = new Set(prev);
        updated.delete(uid);
        return updated;
      });
        }
      }catch(err){
        console.log(err);
      }
      
    }
  };

  const handleConvert = (uid: string) => {
    const leadToConvert = leads.find((lead) => lead.uid === uid);
    if (!leadToConvert) return;

    const newCustomer = {
      uid: `cust-${Date.now()}`,
      name: leadToConvert.name,
      email: leadToConvert.email,
      company: leadToConvert.company,
      source: leadToConvert.source,
      joinedDate: new Date().toLocaleDateString(),
    };

    const existingCustomers = JSON.parse(
      localStorage.getItem("customers") || "[]"
    );
    const updatedCustomers = [...existingCustomers, newCustomer];
    localStorage.setItem("customers", JSON.stringify(updatedCustomers));

    alert(`Lead ${leadToConvert.name} has been converted to a customer.`);
  };

  const handleBulkConvert = async () => {
    const selectedUids = Array.from(selectedLeads);
    if (selectedUids.length === 0)
      return alert("Select at least one lead to convert.");

    try {
      const res = await axios.post("/admin/leads/bulk-convert", {
        uids: selectedUids,
      });
      if (res.data.success) {
        alert(`${selectedUids.length} lead(s) converted to customers.`);
        const response = await axios.get("/admin/leads/all");
        setLeads(response.data);
        setSelectedLeads(new Set());
      } else {
        alert("Conversion failed.");
      }
    } catch (e) {
      console.log(e);
      alert("An error occurred during conversion.");
    }
  };

  const handleSelectLead = (uid: string) => {
    setSelectedLeads((prev) => {
      const updated = new Set(prev);
      if (updated.has(uid)) updated.delete(uid);
      else updated.add(uid);
      return updated;
    });
  };

  const handleSelectAll = () => {
    if (selectedLeads.size === leads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(leads.map((lead) => lead.uid)));
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
          uid: Date.now().toString() + Math.random(),
          name: row.name,
          email: row.email,
          company: row.company,
          source: row.source,
          joinedAt: new Date().toLocaleDateString(),
        }));
        setLeads((prev) => [...prev, ...importedLeads]);
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
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              hidden
            />
          </label>
          <button
            className="add-lead-btn"
            onClick={() => {
              setNewLead({
                name: "",
                email: "",
                company: "",
                source: "",
                joinedAt: "",
              });
              setEditId(null);
              setIsModalOpen(true);
            }}
          >
            Add New Lead
          </button>
          <button className="convert-btn" onClick={handleBulkConvert}>
            Convert to Customer
          </button>
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
                checked={
                  selectedLeads.size === leads.length && leads.length > 0
                }
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.uid}>
              <td>
                <strong>{lead.name}</strong>
                <div className="email">{lead.email}</div>
              </td>
              <td>{lead.company}</td>
              <td>{lead.source}</td>
              <td>{new Date(lead.joinedAt).toLocaleDateString()}</td>
              <td>
                <div className="menu">
                  <button className="dots-btn">⋮</button>
                  <div className="dropdown">
                    <button onClick={() => handleEdit(lead)}>Edit</button>
                    <button onClick={() => handleDelete(lead.uid)}>
                      Delete
                    </button>
                  </div>
                </div>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedLeads.has(lead.uid)}
                  onChange={() => handleSelectLead(lead.uid)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="lead-modal">
            <h3>{editId ? "Edit Lead" : "New Lead"}</h3>
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
              onChange={(e) =>
                setNewLead({ ...newLead, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Company"
              value={newLead.company}
              onChange={(e) =>
                setNewLead({ ...newLead, company: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Source"
              value={newLead.source}
              onChange={(e) =>
                setNewLead({ ...newLead, source: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="PH NO"
              value={newLead.phone}
              onChange={(e) =>
                setNewLead({ ...newLead, phone: e.target.value })
              }
              required
            />
            <div className="modal-actions">
              <button onClick={handleSaveLead}>
                {editId ? "Update" : "Add"} Lead
              </button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
