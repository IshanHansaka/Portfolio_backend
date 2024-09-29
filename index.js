const express = require('express');
const app = express();
const { appendToSheet } = require('./googleSheet');
const bodyParser = require('body-parser');
require('dotenv').config();
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const Project = require('./Project');
const Blog = require('./blog');
const model = require('./chat');
const cors = require('cors');

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/projects', async (req, res) => {
  const project = new Project(req.body);
  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    Object.assign(project, req.body);
    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.deleteOne();
    res.status(200).json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/blogs', async (req, res) => {
  const blog = new Blog(req.body);
  try {
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    Object.assign(blog, req.body);
    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    await blog.deleteOne();
    res.status(200).json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/login', (req, res) => {
  try {
    const { password } = req.body;
    if (password === process.env.ADMIN_PSSWD) {
      res.status(200).json({ message: 'Login successful', success: true });
    } else {
      res.status(401).json({ message: 'Login failed', success: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

app.post('/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, message } = req.body;
    const currentDate = new Date().toLocaleString();

    const row = [currentDate, firstName, lastName, email, phoneNumber, message];
    const result = await appendToSheet(row);

    if (result) {
      res
        .status(200)
        .json({ message: 'Message sent successfully', success: true });
    } else {
      res
        .status(400)
        .json({
          message: 'Failed to append data to Google Sheets',
          success: false,
        });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: err.message });
  }
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  const context = await fsPromises.readFile('./chat/context.txt', 'utf-8');

  const prompt = `You are a knowledgeable and helpful AI chatbot designed to answer questions about Ishan Hansaka Silva. Here's some information about him: ${context}. User says: "${message}". What would you respond?`;

  try {
    const result = await model.generateContent(prompt);
    res.status(200).json({ message: result.response.text() });
    console.log('Response generated successfully.');
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).send('Error processing request.');
  }
});

app.get('/resume', async (req, res) => {
  try {
    const filePath = path.join(__dirname, './resume/resume.pdf');
    if (!fs.existsSync(filePath)) {
      console.log('PDF file not found');
      return res.status(404).json({ message: 'PDF file not found' });
    }
    res.download(filePath, 'resume.pdf', (err) => {
      if (err) {
        console.error('Error downloading the file:', err.message);
        return res
          .status(500)
          .json({ message: 'Error downloading the file', error: err.message });
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = app;
