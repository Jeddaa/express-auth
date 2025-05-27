const { description } = require('@hapi/joi/lib/base');
const Joi = require('joi');

const LoginDto = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

const CreateUserDto = Joi.object({
  userName: Joi.string().min(3).max(30).required(),
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const CreatePostDto = Joi.object({
  title: Joi.string().min(3).max(30).required(),
  description: Joi.string().min(3).required(),
  // tags: Joi.string().email().required(),
  // category: Joi.string().required(),
});


module.exports = { LoginDto, CreateUserDto, CreatePostDto };
