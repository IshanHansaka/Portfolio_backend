const express = require('express');
const app = express();
const { appendToSheet } = require('./googleSheet'); 
const model = require('./chat');
const bodyParser = require('body-parser');

require('dotenv').config();

const Project = require('./Project');
const Blog = require('./blog');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());    //libarary to parse json data

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
            res.status(200).json({ message: 'Message sent successfully', success: true });
        } else {
            res.status(400).json({ message: 'Failed to append data to Google Sheets', success: false });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

app.post("/chat", async (req, res) => {
    const { message } = req.body;

    const context = 
    `Ishan Hansaka Silva, born on December 27, 2002, is a self-motivated and inquisitive undergraduate at the University of Moratuwa, where he is pursuing a Bachelor of Science (Hons) in Information Technology.
    Full name is Hathadura Ishan Hansaka Silva. 
    With a strong passion for exploring innovative solutions within the tech industry, Ishan is eager to leverage his skills and contribute effectively to various projects.
    He is proficient in full-stack development, skilled in developing robust web applications using various frameworks and technologies. Additionally, Ishan has experience programming and integrating ESP32 microcontrollers for hardware projects. 
    He is also adept at technical writing, creating comprehensive technical documents and articles, and capable of producing engaging video content for educational and promotional purposes. 
    Furthermore, Ishan has experience in organizing and managing events within academic and community settings.
    Ishan Hansaka Silva is currently a member of the Event Committee at the IEEE Student Branch of the University of Moratuwa, where he has been actively contributing to organizing events that foster innovation and engagement within the tech community since October 2023. 
    He served as Co-Chairperson for Mora UXplore 2.0 from February 2024 to August 2024, leading the organizing committee for this significant event with a focus on enhancing user experience and promoting technological advancements. 
    Additionally, Ishan was a Design and Editorial Committee Member for Manusath Handa at the Rotaract Club of UOM from May 2023 to April 2024, where he utilized his skills in video creation, flyer design, and scriptwriting. 
    He is also a Technical Writer at LinkIT under INTECS - UoM since September 2023, where he shares his insights through technical publications on Medium [https://medium.com/linkit-intecs]. 
    Moreover, Ishan has been writing on Medium since August 2023, focusing on writing and technical publication[https://medium.com/@ishanhansakasilvahttps://medium.com/@ishanhansakasilva].
    Ishan Hansaka Silva is pursuing a Bachelor of Science (Hons) in Information Technology at the University of Moratuwa, with an expected graduation date of 2027. 
    Prior to this, he attended Ananda Shasthralaya National School, where he completed his studies in the Physical Science Stream from 2019 to 2022. 
    Ishan's educational journey began at Aluthgama Maha Vidyalaya, where he studied from 2008 to 2019.
    Ishan Hansaka Silva has been involved in several noteworthy projects. 
    One of them is Game Mind, a web application integrated with an interactive learning assistance system, developed as part of a first-year hardware project. 
    You can find the project on GitHub here[https://github.com/IshanHansaka/Game_Mind]. 
    Another project, SereniCraft, is an e-commerce website dedicated to showcasing and selling authentic Sri Lankan handcrafts, which can be viewed here [https://github.com/First-Year-Web-Technology-Project/SeriniCraft]. 
    Ishan also contributed to TripSuthra, a user-friendly tourism web app that offers personalized destination recommendations, bookings for drivers and guides, and streamlined visa application assistance, available here [https://github.com/ashiduDissanayake/TripSuthra]. 
    Lastly, he developed DressUp, a simple online store built with Nuxt 3 and the Fake Store API, allowing users to easily view product details; the project can be accessed here [https://github.com/IshanHansaka/DressUp].
    Ishan Hansaka Silva has written several insightful articles on various topics. 
    One of his articles, What is Computational Thinking (published on August 2, 2023), explores problem-solving through computational thinking. 
    You can read it at the following link: https://medium.com/linkit-intecs/problem-solving-via-computational-thinking-77cf78322066. 
    Another article, The Compilation Process of C Language (published on September 5, 2023), provides a detailed look at how C code is converted into machine code, available at https://medium.com/linkit-intecs/the-compilation-process-of-c-language-a37b3bfdfd00. 
    Ishan also authored Get Started with Recursion (published on December 26, 2023), introducing recursive functions in C, which can be accessed at https://medium.com/linkit-intecs/get-started-with-recursion-a4de459142b5. 
    His article Enhance Your Node.js App Security with dotenv (published on May 18, 2024) offers a guide on managing environment variables effectively, found at https://medium.com/linkit-intecs/enhance-your-node-js-app-security-with-dotenv-ee76d53162f8. 
    Lastly, he wrote Build Express App with Firestore and Deploy on Choreo (published on June 30, 2024), a step-by-step guide on integrating databases and deployment, which can be read at https://medium.com/linkit-intecs/build-express-app-with-firebase-and-deploy-on-choreo-07152f2423ba.
    Ishan Hansaka Silva possesses professional working proficiency in English and is a native speaker of Sinhalese, showcasing his bilingual capabilities. 
    This linguistic proficiency enhances his ability to communicate effectively in diverse environments and contributes to his engagement in both local and international contexts.
    Ishan Hansaka Silva achieved commendable results in his academic pursuits. In the G.C.E. Advanced Level examinations, he earned a Z-score of 1.8561 in February, with grades of A in Physics and Combined Mathematics, and a B in Chemistry. 
    Additionally, in the G.C.E. Ordinary Level examinations conducted in December 2018, he excelled with a remarkable score of 9 A's. 
    His Ordinary Level grades include A in Science, Mathematics, Information & Communication Technology, English, Buddhism, Sinhala, History, Art, and Business & Accounting Studies, reflecting his strong foundation in a diverse range of subjects.
    Ishan Hansaka Silva holds several certifications that demonstrate his proficiency in various programming languages and web design. He completed the Introduction to C course from Sololearn, issued in July 2023, which equipped him with skills in the C programming language. 
    Additionally, he earned a certification in Python for Beginners from the Centre for Open & Distance Learning (CODL) at the University of Moratuwa, Sri Lanka, issued in June 2023, with a credential ID of E2Yh10D68u, showcasing his skills in Python. 
    Furthermore, he completed the Web Design for Beginners course from the same institution in April 2023, with a credential ID of 0ZXxbYB0Fv, highlighting his foundational skills in web design.
    Ishan Hansaka Silva can be reached at his address, 14, "Nilanka", Kandevihara Road, Kaluwamodara, Aluthgama. He is available by phone at +94775437008 and can be contacted via email at ishanhansakasilva@gmail.com. For professional networking, he maintains a LinkedIn profile, which can be found at https://www.linkedin.com/in/ishanhansakasilva/. 
    and he shares insights and articles on his blog at https://medium.com/@ishanhansakasilva.`;

    const prompt = `You are a knowledgeable and helpful AI chatbot designed to answer questions about Ishan Hansaka Silva. Here's some information about him: ${context}. User says: "${message}". What would you respond?`;

    try {
        const result = await model.generateContent(prompt); // Ensure your model is set up correctly
        res.status(200).json({ message: result.response.text() });
        console.log("Response generated successfully.");
    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).send("Error processing request.");
    }
});

module.exports = app;