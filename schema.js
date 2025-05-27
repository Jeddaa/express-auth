const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isVerified: { type: Boolean, default: false },
    isAuthor: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const UserModel = mongoose.model('User', userSchema);


const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: UserModel,
    },
    verificationToken: { type: String, required: true },
    verificationTokenExpires: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);
const TokenModel = mongoose.model('Token', tokenSchema);

const postSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: UserModel,
    },
    title: { type: String },
    description: { type: String },
    // tags: { type: String, required: true },
    // category: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);
const PostModel = mongoose.model('Post', postSchema);


// module.exports={userSchema}

module.exports = { UserModel, TokenModel, PostModel };
