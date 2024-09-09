const mongoose = require('./db'); //this is one of end point that connect in index.js

const blogSchema = new mongoose.Schema({ //describe about project schema
    title: String,
    content: String,
    date: Date,
    medium_link: String
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
