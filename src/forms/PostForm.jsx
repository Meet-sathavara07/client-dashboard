// PostForm.jsx
import React, { useState } from 'react';

const PostForm = ({ clients, onSubmit, onCancel, error }) => {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedClients, setSelectedClients] = useState([]);

  const handlePostFormSubmit = (e) => {
    e.preventDefault();

    if (!selectedClients.length || !postTitle || !postContent) {
      onSubmit('Please select at least one client and fill in all required fields');
      return;
    }

    onSubmit(null, {
      clientIds: selectedClients,
      subject: postTitle,
      description: postContent,
    });
  };

  const handleCheckboxChange = (e, clientId) => {
    if (e.target.checked) {
      setSelectedClients([...selectedClients, clientId]);
    } else {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    }
  };

  return (
    <div className="mb-8 bg-white p-6 shadow-md rounded-lg">
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
  );
};

export default PostForm;
