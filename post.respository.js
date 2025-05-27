const {PostModel} = require('./schema')
class PostRepository {
  constructor() {
    this.PostModel = PostModel;
  }
  create(data) {
    return this.PostModel.create(data);
  }
  findOne(data) {
    return this.PostModel.findOne(data);
  }
  findAllByData(data) {
    return this.PostModel.find(data);
  }
  findAll() {
    return this.PostModel.find();
  }

  findOnePostAndAuthor(postId) {
    return this.PostModel.aggregate([
      {
        $match: {
          _id: postId,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind:'$author',
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          authorFirstName: '$author.firstName',
          authorLastName: '$author.lastName',
          authorUserName: '$author.userName',
          authorEmail: '$author.email',
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
  }

  findPostsAndAuthor() {
    return this.PostModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: {
          path: '$author',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          authorFirstName: '$author.firstName',
          authorlastName: '$author.lastName',
          authoruserName: '$author.userName',
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
  }

  findPostsBySpecificAuthor(authorId) {
    return this.PostModel.aggregate([
      {
        $match: {
          authorId: authorId,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: {
          path: '$author',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          authorFirstName: '$author.firstName',
          authorlastName: '$author.lastName',
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
  }
}
module.exports = new PostRepository()
