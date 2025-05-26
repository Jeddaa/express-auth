const { TokenModel } = require('./schema');
const mongoose = require('mongoose')
class TokenRepository {
  constructor() {
    this.TokenModel = TokenModel;
  }
  create(data) {
    return this.TokenModel.create(data);
  }
  findOneByUserId(data) {
    return this.TokenModel.findOne(...data);
  }
}
module.exports = new TokenRepository();
