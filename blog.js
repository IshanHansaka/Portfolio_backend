const mongoose = require('./db'); //this is one of end point that connect in index.js

const blogSchema = new mongoose.Schema({ //describe about project schema
    title: String,
    content: String,
    Date: Date,
});

const Blog = mongoose.model('blog', blogSchema);

module.exports = Blog;
