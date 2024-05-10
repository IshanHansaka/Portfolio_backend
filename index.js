const express = require('express'); //create an express app
const app = express();
const port = 5000; //back_end is running on 5000 port and front_end is running on 3000


require('dotenv').config();
const Project = require('./Project');

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/projects', async (req, res) => {  // /projects end point
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/blogs', async (req, res) => { // /blogs end point
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`); //run node app
});
