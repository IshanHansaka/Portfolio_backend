const request = require('supertest');
const app = require('../index.js');
const { appendToSheet } = require('../googleSheet');

jest.mock('../googleSheet', () => ({
    appendToSheet: jest.fn(),
}));

describe('POST /contact', () => {
    const validContactData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+94775421004',
        message: 'Hello, this is a test message.',
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should call appendToSheet with correct data, including date', async () => {
        const currentDate = new Date().toLocaleString();
        appendToSheet.mockResolvedValueOnce({
            updates: { updatedRows: 1 },
        });

        await request(app)
            .post('/contact')
            .send(validContactData)
            .expect(200);

        expect(appendToSheet).toHaveBeenCalledWith([
            currentDate,
            'John',
            'Doe',
            'john.doe@example.com',
            '+94775421004',
            'Hello, this is a test message.',
        ]);
    });

    test('should return 400 if appending to Google Sheets fails', async () => {
        appendToSheet.mockResolvedValueOnce(null);

        const response = await request(app)
            .post('/contact')
            .send(validContactData)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toEqual({
            message: 'Failed to append data to Google Sheets',
            success: false,
        });
    });

    test('should return 500 for internal server error', async () => {
        appendToSheet.mockRejectedValueOnce(new Error('Google Sheets error'));

        const response = await request(app)
            .post('/contact')
            .send(validContactData)
            .expect('Content-Type', /json/)
            .expect(500);

        expect(response.body).toEqual({
            message: 'Internal Server Error',
            error: 'Google Sheets error',
        });
    });
});