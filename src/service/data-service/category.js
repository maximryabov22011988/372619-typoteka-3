'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll({withCount} = {}) {
    if (withCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                `*`
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLES_CATEGORIES,
          attributes: []
        }]
      });

      return result.map((it) => it.get());
    }

    return await this._Category.findAll({raw: true});
  }

  async countByCategory(id) {
    const result = await this._ArticleCategory.findAll({
      where: {CategoryId: id}
    });
    const count = result.length;
    return +count;
  }

  async findByName(name) {
    return await this._Category.findOne({where: {name}});
  }

  async create(name) {
    const category = await this._Category.create({
      name
    });
    return category.get();
  }

  async update(id, name) {
    const newCategoryData = {name};
    return await this._Category.update(newCategoryData, {
      where: {id}
    });
  }

  async delete(id) {
    const deletedRows = await this._Category.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = CategoryService;
