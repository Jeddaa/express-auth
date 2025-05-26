// user.dto.js
// const { IsEmail, IsString, Length } = require('class-validator');

// class LoginDto {
//   @IsEmail()
//   email;

//   @IsString()
//   // @Length(6, 20)
//   password;
// }

const Joi = require('joi');

const LoginDto = Joi.object({
  // username: Joi.string().min(3).max(30).required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

const CreateUserDto = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// class CreateUserDto {
//   @IsEmail()
//   userName;

//   @IsEmail()
//   firstName;

//   @IsEmail()
//   lastName;

//   @IsEmail()
//   email;

//   @IsString()
//   @Length(6, 20)
//   password;
// }


module.exports = { LoginDto, CreateUserDto };
