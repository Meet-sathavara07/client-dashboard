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

        // Sort posts by sentDate in descending order (latest first)
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
      <div className="p-6 min-h-screen max-w-screen-md mx-auto">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <h2 className="text-3xl font-bold mb-6">Posts</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 border-b">
                <th className="p-3 text-left">Client Names</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Sent Date</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="border-b">
                  <td className="p-3">{post.clientNames.join(', ')}</td>
                  <td className="p-3">{post.subject}</td>
                  <td className="p-3">{post.description}</td>
                  <td className="p-3">{new Date(post.sentDate).toLocaleString()}</td>
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
