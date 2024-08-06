import React, { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';

function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post('http://localhost:4000/insert', {
        firstName: name,
        companyRole: role
      });

      console.log(response.data);
      setName("");
      setRole("");                  
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  useEffect(() => {
    setName("");
    setRole("");
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="logIn-form">
          <form onSubmit={handleSubmit}>
            <p>First Name</p>

            <input
              className="Name"
              type="text"
              placeholder="First name ..."
              value={name} 
              onChange={(e) => setName(e.target.value)}
            />

            <p> Company Role</p>

            <input
              className="Role"
              type="text"
              placeholder="Role...."
              value={role} 
              onChange={(e) => setRole(e.target.value)}
            />

            <button type="submit">Submit</button>
          </form>
        </div>
      </header>
    </div>
  );
}

export default App;
