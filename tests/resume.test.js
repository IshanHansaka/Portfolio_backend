const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../index.js');

describe('GET /resume', () => {
  const originalFilePath = path.join(__dirname, '../resume/resume.pdf');

  it('should return the resume PDF file', async () => {
    const response = await request(app).get('/resume');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');
    expect(response.headers['content-disposition']).toContain(
      'attachment; filename="resume.pdf"'
    );
  });

  it('should return 404 when the PDF file does not exist', async () => {
    const nonExistingFilePath = path.join(__dirname, '../resume/nonexistent.pdf');
    if (fs.existsSync(originalFilePath)) {
      fs.renameSync(originalFilePath, nonExistingFilePath);
    }

    const response = await request(app).get('/resume');
    
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('PDF file not found');

    if (fs.existsSync(nonExistingFilePath)) {
      fs.renameSync(nonExistingFilePath, originalFilePath);
    }
  });
});