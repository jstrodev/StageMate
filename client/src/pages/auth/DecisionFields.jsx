import React from 'react';

const DecisionFields = ({ status, setStatus, decision, setDecision }) => {
  return (
    <div className="flex space-x-4 mb-4">
      <div>
        <label className="block mb-2">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2"
        >
          <option value="">Select Status</option>
          <option value="Prospect">Prospect</option>
          <option value="Qualified">Qualified</option>
          <option value="Contacted">Contacted</option>
          <option value="Booked">Booked</option>
          <option value="Completed">Completed</option>
          <option value="Lost">Lost</option>
        </select>
      </div>
      <div>
        <label className="block mb-2">Decision</label>
        <select
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          className="border p-2"
        >
          <option value="">Select Decision</option>
          <option value="Rebook">Rebook</option>
          <option value="Undecided">Undecided</option>
          <option value="Do Not Rebook">Do Not Rebook</option>
        </select>
      </div>
    </div>
  );
};

export default DecisionFields;