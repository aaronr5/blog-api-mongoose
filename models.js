const mongoose = require('mongoose');

const BlogPostSchema = mongoose.Schema({
  author: {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
  },
  title: {type: String, required: true},
  content: {type: String, required: true},
  dateCreated: {type: Date, default: Date.now}
});

BlogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

BlogPostSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    author: this.authorName,
    title: this.title,
    content: this.content,
    dateCreated: this.dateCreated
  };
}

const BlogPost = mongoose.model('Posts', BlogPostSchema);

module.exports = {BlogPost};
