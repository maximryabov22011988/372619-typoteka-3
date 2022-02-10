'use strict';

const {generateId} = require(`../../utils`);

class CommentService {
  create(article, commentData) {
    const newComment = Object.assign({id: generateId()}, commentData);
    article.comments.push(newComment);
    return newComment;
  }

  delete(article, commentId) {
    const deletedComment = article.comments.find((comment) => comment.id === commentId);
    if (!deletedComment) {
      return null;
    }
    article.comments = article.comments.filter((comment) => comment.id !== commentId);
    return deletedComment;
  }

  findAll(article) {
    return article.comments;
  }
}

module.exports = CommentService;
