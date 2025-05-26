const {UserModel} = require('./schema');
class UserRepository {
  constructor() {
    this.UserModel = UserModel;
  }
  create(data) {
    return this.UserModel.create(data);
  }
  findOneByEmail(email) {
    return this.UserModel.findOne({ email: email });
  }
  findOneByUserId(userId) {
    return this.UserModel.findById(userId);
  }
}
module.exports = new UserRepository();
