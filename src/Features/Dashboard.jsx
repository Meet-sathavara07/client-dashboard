import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [pan, setPan] = useState('');
  const [email, setEmail] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [showClientTable, setShowClientTable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:5000/clients');
        if (!response.ok) throw new Error('Failed to fetch clients');
        const data = await response.json();
        setClients(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching clients:', error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/client-with-posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        data.sort((a, b) => new Date(b.sentDate) - new Date(a.sentDate));
        setPosts(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
    fetchClients();
  }, []);

  const addClient = async (clientData) => {
    try {
      const response = await fetch('http://localhost:5000/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add client');
      }

      const newClient = await response.json();
      setClients([newClient, ...clients]);
    } catch (error) {
      setError(error.message);
      console.error('Error adding client:', error);
    }
  };

  const deleteClient = async (clientId) => {
    try {
      const response = await fetch(`http://localhost:5000/clients/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.error('Client not found:', clientId);
          setError('Client not found');
        } else {
          throw new Error('Failed to delete client');
        }
      }

      setClients(clients.filter(client => client._id !== clientId));
    } catch (error) {
      setError(error.message);
      console.error('Error deleting client:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addClient({ name, pan, email });
    setName('');
    setPan('');
    setEmail('');
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedClients(clients.map(client => client._id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleCheckboxChange = (e, clientId) => {
    if (e.target.checked) {
      setSelectedClients([...selectedClients, clientId]);
    } else {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    }
  };

  const handlePostFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClients.length || !postTitle || !postContent) {
      setError('Please select at least one client and fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientIds: selectedClients,
          subject: postTitle,
          description: postContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send post');
      }

      alert('Post sent successfully!');
      setPostTitle('');
      setPostContent('');
      setSelectedClients([]);
      navigate('/posts'); // Navigate to /posts after successful submission
    } catch (error) {
      setError(error.message);
      console.error('Error sending post:', error);
    }
  };

  return (
    <div className='bg-gray-100 min-h-screen'>
      <div className='p-6  max-w-screen-lg mx-auto'>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <h2 className="text-3xl font-bold mb-6">Clients Dashboard</h2>

        {/* Buttons */}
        <div className="mb-8">
        <button
            onClick={() => {
              setShowAddClientForm(!showAddClientForm);
              setShowPostForm(false);
              setShowClientTable(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md  "
          >
            {showAddClientForm ? 'Hide Add Client Form' : 'Add Client'}
          </button>
          <button
            onClick={() => {
              setShowPostForm(!showPostForm);
              setShowAddClientForm(false);
              setShowClientTable(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md ml-4"
          >
            {showPostForm ? 'Hide Post Form' : 'Send Post'}
          </button>
          
          <button
            onClick={() => navigate('/posts')}
            className="bg-red-900 hover:bg-red-950 text-white py-2 px-4 rounded-lg shadow-md ml-4 "
          >
            View Posts
          </button>
        </div>

        {/* Show Post Form */}
        {showPostForm && (
          <div className="mb-8 bg-white shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-4">Send Post</h3>
            <form onSubmit={handlePostFormSubmit}>
              <div className="mb-4">
                <label htmlFor="postTitle" className="font-medium text-gray-700">Title</label>
                <input
                  id="postTitle"
                  type="text"
                  placeholder="Post title"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="postContent" className="font-medium text-gray-700">Content</label>
                <textarea
                  id="postContent"
                  placeholder="Post content"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              {error && <p className="text-red-600 mt-4">{error}</p>}
              <br />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md"
              >
                Send Post
              </button>
            </form>
          </div>
        )}

        {/* Show Add Client Form */}
        {showAddClientForm && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 bg-white shadow-md rounded-lg mb-8">
            <label htmlFor="name" className="font-medium text-gray-700">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter client name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded-lg"
            />
            <label htmlFor="pan" className="font-medium text-gray-700">PAN</label>
            <input
              id="pan"
              type="text"
              placeholder="Enter client PAN"
              value={pan}
              onChange={(e) => setPan(e.target.value)}
              className="p-2 border rounded-lg"
            />
            <label htmlFor="email" className="font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter client email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded-lg"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md mt-4"
            >
              Add Client
            </button>
          </form>
        )}


       

        {/* Show Clients Table */}
        {showClientTable && (
          <div className="overflow-x-auto mb-8">
            <table className="w-full table-auto bg-white shadow-md rounded-lg border-2 border-black">
              <thead>
                <tr className="bg-gray-200 border-b border-black">
                  <th className="p-3 min-h-16 border-l border-r border-black ">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        className="form-checkbox h-4 w-4"
                        style={{ margin: 0 }} // Remove default margin
                      />
                      <span className="text-center text-sm">Select All</span>
                    </label>
                  </th>
                  <th className="p-3 border-l border-r border-black ">Name</th>
                  <th className="p-3 border-l border-r border-black ">PAN</th>
                  <th className="p-3 border-l border-r border-black ">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.slice().reverse().map((client, index) => (
                  <tr key={client._id} className="border-b border-black">
                    <td className="p-3 border-l border-r border-black ">
                      <input
                        type="checkbox"
                        checked={selectedClients.includes(client._id)}
                        onChange={(e) => handleCheckboxChange(e, client._id)}
                        className="form-checkbox h-4 w-4"
                      />
                    </td>
                    <td className="p-3 border-l border-r border-black ">{client.name}</td>
                    <td className="p-3 border-l border-r border-black ">{client.pan}</td>
                    <td className="p-3 border-l border-r border-black ">
                      <button
                        onClick={() => deleteClient(client._id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded-lg shadow-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/*  post */}
      <div className="p-6 min-h-screen max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Posts</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white shadow-md rounded-lg border-2 border-black">
            <thead>
              <tr className="bg-gray-200 border-b border-black">
                <th className="p-2 border-l border-r border-black text-center">No</th>
                <th className="p-3 border-l border-r border-black text-center">Client Names</th>
                <th className="p-3 border-l border-r border-black text-center">Subject</th>
                <th className="p-3 border-l border-r border-black text-center">Description</th>
                <th className="p-3 border-l border-r border-black text-center">Sent Date</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => (
                <tr key={post._id} className="border-b border-black">
                  <td className="p-2 border-l border-r border-black text-center">{index + 1}</td>
                  <td className="p-3 max-w-72 border-l border-r border-black">{post.clientNames.join(', ')}</td>
                  <td className="p-3 min-w-28 border-l border-r border-black">{post.subject}</td>
                  <td className="p-3 max-w-sm border-l border-r border-black">{post.description}</td>
                  <td className="p-3 border-l border-r border-black">{new Date(post.sentDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        
    </div>
  );
}

export default Dashboard;
