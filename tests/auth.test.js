const request = require('supertest');
const app = require('../index.js');

require('dotenv').config();

describe('/login endpoint', () => {

    beforeAll(() => {
        process.env.ADMIN_PSSWD = 'correct_password';
    });

    it('should return 200 and success message for correct password', async () => {
        const response = await request(app)
            .post('/login')
            .send({ password: 'correct_password' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.success).toBe(true);
    });

    it('should return 401 for incorrect password', async () => {
        const response = await request(app)
            .post('/login')
            .send({ password: 'wrong_password' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Login failed');
        expect(response.body.success).toBe(false);
    });
});