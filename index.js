const express = require('express'); //create an express app
const app = express();
const port = 5000; //back_end is running on 5000 port and front_end is running on 3000

require('dotenv').config();
const Project = require('./Project');
const Blog = require('./blog');
const cors = require('cors');

app.use(cors());
app.use(express.json());    //libarary to parse json data

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/projects', async (req, res) => {  //read the project
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/projects', async (req, res) => { //write the project
    const project = new Project(req.body);
    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.patch('/projects/:id', async (req, res) => { //update the project
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        Object.assign(project, req.body);
        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/projects/:id', async (req, res) => { //delete the project
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        await project.deleteOne();
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/blogs', async (req, res) => { //blogs end point
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