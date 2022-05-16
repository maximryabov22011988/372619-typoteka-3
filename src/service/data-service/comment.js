'use strict';

const Aliase = require(`../models/aliase`);

const MAX_DISPLAYED_LATEST_COMMENTS = 4;

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async create(articleId, commentData) {
    return await this._Comment.create({
      articleId,
      ...commentData
    });
  }

  async delete(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll(articleId) {
    return await this._Comment.findAll({
      where: {
        articleId
      },
      raw: true
    });
  }

  async findLatest() {
    return await this._Comment.findAll({
      include: [
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        },
      ],
      order: [
        [`createdAt`, `DESC`]
      ],
      limit: MAX_DISPLAYED_LATEST_COMMENTS,
    });
  }
}

module.exports = CommentService;
