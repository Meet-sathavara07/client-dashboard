const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Client = require('./src/models/dataSchema');
const Post = require('./src/models/postSchema');
const { generateUniqueId } = require('./src/models/generateUniqueId'); // Adjust path as needed


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/client-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

  app.post('/clients', async (req, res) => {
    try {
      const uniqueId = await generateUniqueId();
      const newClient = new Client({ ...req.body, _id: uniqueId });
      const savedClient = await newClient.save();
      res.status(201).json(savedClient);
    } catch (err) {
      console.error('Error saving client:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
app.get('/clients', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Client.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ message: 'Client deleted' });
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/posts', async (req, res) => {
  try {
    const { clientIds, subject, description } = req.body;

    if (!clientIds || !subject || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newPost = new Post({
      clientIds,
      subject,
      description,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error('Error saving post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Add this new route in your server.js
app.get('/posts-with-client-names', async (req, res) => {
  try {
    // Fetch all posts
    const posts = await Post.find({}).lean();
    
    // Collect unique client IDs from posts
    const clientIds = [...new Set(posts.flatMap(post => post.clientIds))];
    
    // Fetch client details based on clientIds
    const clients = await Client.find({ _id: { $in: clientIds } }).lean();
    const clientMap = clients.reduce((map, client) => {
      map[client._id] = client.name;
      return map;
    }, {});

    // Map client names to posts
    const postsWithNames = posts.map(post => ({
      ...post,
      clientNames: post.clientIds.map(id => clientMap[id] || 'Unknown'),
    }));

    res.json(postsWithNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
