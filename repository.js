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
  findOne(data) {
    return this.UserModel.findOne(data);
  }
  findOneByUserId(userId) {
    return this.UserModel.findById(userId);
  }
  findOneWithoutPassword(data) {
    return this.UserModel.findOne(data).select('-password');
  }
  findAll() {
    return this.UserModel.find();
  }
  findAllAuthors() {
    return this.UserModel.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'authorId',
          as: 'posts',
        },
      },
      {
        $match: {
          'posts.0': { $exists: true }, // Filters users with at least one post
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          userName: 1,
          email: 1,
          createdAt: 1,
          updatedAt: 1,
          // posts: 1,
        },
      },
    ]);
  }
}
module.exports = new UserRepository();
