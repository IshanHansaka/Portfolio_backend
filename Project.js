const mongoose = require('./db'); //this is one of end point that connect in index.js

const projectSchema = new mongoose.Schema({
  //describe about project schema
  p_id: String,
  name: String,
  description: String,
  github_link: String,
  tools: [String],
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
