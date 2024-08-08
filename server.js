const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Client = require('./src/models/clientSchema');
const Post = require('./src/models/postSchema');
const CaPost = require('./src/models/caPostSchema');



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
// POST /clients route
app.post('/clients', async (req, res) => {
  try {
    const newClient = new Client(req.body);
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (err) {
    console.error('Error saving client:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /clients route
app.get('/clients', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /clients/:id route
app.delete('/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Client.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Add the deleted ID to the DeletedId collection
    await DeletedId.create({ _id: id });

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


app.get('/posts-with-client-names', async (req, res) => {
  try {
    const posts = await Post.find({}).lean();
    
    const clientIds = [...new Set(posts.flatMap(post => post.clientIds))];
    
    const clients = await Client.find({ _id: { $in: clientIds } }).lean();
    const clientMap = clients.reduce((map, client) => {
      map[client._id] = client.name;
      return map;
    }, {});

    const postsWithNames = posts.map(post => ({
      ...post,
      clientNames: post.clientIds.map(id => clientMap[id] || 'Unknown'),
    }));

    res.json(postsWithNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/client-with-posts', async (req, res) => {
  try {
    const caposts = await CaPost.find({}).lean();
    const clientIds = [...new Set(caposts.flatMap(post => post.clientIds))];
    const clients = await Client.find({ _id: { $in: clientIds } }).lean();
    const clientMap = clients.reduce((map, client) => {
      map[client._id] = client.name;
      return map;
    }, {});
    const capostsWithNames = caposts.map(post => ({
      ...post,
      clientNames: post.clientIds.map(id => clientMap[id] || 'Unknown'),
    }));
    res.json(capostsWithNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Example: POST endpoint for adding new posts
app.post('/ca-posts', async (req, res) => {
  try {
    const { clientIds, subject, description } = req.body;
    const newPost = new CaPost({
      clientIds,
      subject,
      description,
      sentDate: new Date(),
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Example: GET endpoint for fetching all posts
app.get('/ca-posts', async (req, res) => {
  try {
    const posts = await CaPost.find().populate('clientIds', 'name').exec();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
