'use strict';

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async create(userData) {
    const user = await this._User.create(userData);
    return user.get();
  }

  async findByEmail(email) {
    const foundUser = await this._User.findOne({
      where: {email}
    });
    return foundUser && foundUser.get();
  }
}

module.exports = UserService;
