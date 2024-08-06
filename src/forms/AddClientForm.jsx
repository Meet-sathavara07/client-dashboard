import React, { useState } from 'react';

const AddClientForm = ({ onAddClient }) => {
  const [clientName, setClientName] = useState('');
  const [clientPan, setClientPan] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !clientPan) {
      setError('Both fields are required');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: clientName, pan: clientPan }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add client');
      }

      const newClient = await response.json();
      onAddClient(newClient);
      setClientName('');
      setClientPan('');
      setError('');
    } catch (error) {
      setError(error.message);
      console.error('Error adding client:', error);
    }
  };

  return (
    <div className="mb-8 bg-white p-6 shadow-md rounded-lg">
      <h3 className="text-2xl font-bold mb-4">Add New Client</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="clientName" className="font-medium text-gray-700">Name</label>
          <input
            id="clientName"
            type="text"
            placeholder="Client name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="clientPan" className="font-medium text-gray-700">PAN</label>
          <input
            id="clientPan"
            type="text"
            placeholder="Client PAN"
            value={clientPan}
            onChange={(e) => setClientPan(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        {error && <p className="text-red-600 mt-4">{error}</p>}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md"
        >
          Add Client
        </button>
      </form>
    </div>
  );
};

export default AddClientForm;
