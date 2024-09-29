const request = require('supertest');
const path = require('path');
const app = require('../index.js');

describe('GET /resume', () => {
    it('should return the resume PDF file', async () => {
        const response = await request(app).get('/resume');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/pdf');
        expect(response.headers['content-disposition']).toContain('attachment; filename="resume.pdf"');
    });
});