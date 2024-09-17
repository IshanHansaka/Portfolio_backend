const app = require('./index');
require('./db');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});