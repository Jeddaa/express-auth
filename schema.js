const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userName: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);
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

const bookSchema = new mongoose.Schema(
  {
    userId: { type: String },
    title: { type: String },
    description: { type: String },
    email: { type: String },
    password: { type: String },
  },
  {
    timestamps: true,
  },
);

// module.exports={userSchema}
const TokenModel = mongoose.model('Token', tokenSchema);
module.exports = { UserModel, TokenModel };
