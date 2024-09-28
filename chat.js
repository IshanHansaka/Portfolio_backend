const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINIi_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports = model