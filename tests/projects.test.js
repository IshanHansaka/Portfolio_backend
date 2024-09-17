const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index.js');

require('dotenv').config();

/* Connecting to the database before tests. */
beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.DB_URL, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
      });
    } catch (error) {
      console.error('Database connection error:', error);
    }
  }
});

/* Closing database connection after tests. */
afterAll(async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait before dropping database
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
});

describe('/projects endpoint', () => {
  let projectId;

  it('should fetch all projects', async () => {
    const res = await request(app).get('/projects');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  });

  it('should create a new project', async () => {
    const res = await request(app)
      .post('/projects')
      .send({ 
        name: 'Test Project', 
        description: 'A test project', 
        github_link: 'https://github.com/test', 
        tools: ['Node.js', 'MongoDB'] 
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Test Project');
    projectId = res.body._id;
  });

  it('should update an existing project', async () => {
    const res = await request(app)
      .patch(`/projects/${projectId}`)
      .send({ 
        name: 'Updated Test Project', 
        description: 'updated test project', 
        github_link: 'https://github.com/updatetest', 
        tools: ['Node.js', 'MongoDB'] 
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Test Project'); 
    expect(res.body.description).toBe('updated test project');
    expect(res.body.github_link).toBe('https://github.com/updatetest');
  });

  it('should delete a project', async () => {
    const res = await request(app).delete(`/projects/${projectId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Project deleted');
  });
});