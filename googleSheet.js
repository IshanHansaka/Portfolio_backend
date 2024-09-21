const { google } = require('googleapis');
require('dotenv').config();

const credentials = JSON.parse(process.env.GOOGLE_SHEET_CREDENTIALS);
const spreadsheetId = process.env.SPREADSHEET_ID;

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const appendToSheet = async (values) => {
    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: 'Sheet1!A2:E2',
            valueInputOption: 'RAW',
            resource: {
                values: [values],
            },
        });
        return response.data.updates;
    } catch (error) {
        throw new Error('Failed to append data to Google Sheets: ' + error.message);
    }
};

module.exports = { appendToSheet };