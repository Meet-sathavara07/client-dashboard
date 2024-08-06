import React, { useState, useEffect } from 'react';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/posts-with-client-names');
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
  }, []);

  return (
    <div className='bg-gray-100'>
      <div className="p-6 min-h-screen max-w-screen-xl mx-auto">
        {error && <p className="text-red-600 mb-4">{error}</p>}
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

export default Posts;
