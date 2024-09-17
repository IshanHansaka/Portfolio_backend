const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

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


describe('/blogs endpoint', () => {
  let blogId;

  it('should fetch all blogs', async () => {
    const res = await request(app).get('/blogs');
    expect(res.statusCode).toBe(200);    
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  });

  it('should create a new blog', async () => {
    const res = await request(app)
      .post('/blogs')
      .send({ 
        title: 'Test Blog', 
        content: 'test blog post', 
        date: new Date(), 
        medium_link: 'https://medium.com/test' 
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('Test Blog');
    blogId = res.body._id;
  });

  it('should update an existing blog', async () => {
    const res = await request(app)
      .patch(`/blogs/${blogId}`)
      .send({ 
        title: 'Updated Test Blog', 
        content: 'updated test blog post', 
        date: new Date(), 
        medium_link: 'https://medium.com/updatetest' 
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Test Blog');
    expect(res.body.content).toBe('updated test blog post');
    expect(res.body.medium_link).toBe('https://medium.com/updatetest');
  });

  it('should delete a blog', async () => {
    const res = await request(app).delete(`/blogs/${blogId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Blog deleted');
  });
});