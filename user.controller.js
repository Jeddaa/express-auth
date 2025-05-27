const userRepository = require('./repository')
const tokenRepository = require('./token.repository')
const sendEmail = require('./utils')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const crypto = require('crypto');

const createToken = async (newUser) => {
  const checktoks = await tokenRepository.findOneByUserId({
    userId: newUser._id,
    verificationTokenExpires: { $gt: new Date() },
  });
  if(checktoks){
    const verificationLink = `http://localhost:3000/api/auth/verify/${newUser._id}/${checktoks.verificationToken}`;
    console.log('verification link', verificationLink);
    // sendEmail(
    //   newUser.email,
    //   'Account Verification',
    //   `<p>Please verify your email by clicking the link: <a href="${verificationLink}">Verify Email</a></p>`,
    // );
    return true;
  }
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpires = new Date(Date.now() + 3600000);
  const createToken = await tokenRepository.create({
    userId: newUser._id,
    verificationToken: verificationToken,
    verificationTokenExpires: verificationTokenExpires,
  });
  if (createToken) {
    const verificationLink = `http://localhost:3000/api/auth/verify/${newUser._id}/${createToken.verificationToken}`;
    console.log('verification link', verificationLink);
    // sendEmail(
    //   newUser.email,
    //   'Account Verification',
    //   `<p>Please verify your email by clicking the link: <a href="${verificationLink}">Verify Email</a></p>`,
    // );
    return true;
  } else {
    return false;
  }
};

exports.createUser = async (req, res) => {
    try {
      const existingUser = await userRepository.findOneByEmail( req.body.email );
      if (existingUser) {
        return res.status(400).json({ error: 'email address already in use' });
      }
      const checkUsername = await userRepository.findOne({userName: req.body.userName})
      if(checkUsername){
        return res.status(400).json({ error: 'userName already in use' });
      }
      const hashed = bcrypt.hashSync(req.body.password, 10)
      const newUser = await userRepository.create({
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashed,
        isVerified: false,
      });
      if(newUser){
        const createToks = createToken(newUser)
        if (createToks) {
          return res.status(201).json({
            message:
              'Registration successful. Please check your email to validate your account',
          });
        } else {
          return res.status(400).send('token not created');
        }
      }
    } catch(error){
      res.status(500).json({error: 'internal server error'
      });
        console.log("error", error);
    }
  }


  exports.verifyUser = async(req, res)=>{
    try{
      const userId = new mongoose.Types.ObjectId(req.params.userId);
      const getUser = await userRepository.findOneByUserId(userId);
      if(getUser.isVerified){
        return res
          .status(201)
          .json({
            message: 'Email already verified. Please proceed to log in.',
          });
      }
      const token = req.params.token
      const getToken = await tokenRepository.findOneByUserId({userId: userId, verificationToken: token, verificationTokenExpires: {$gt: new Date()} });
      if(!getToken) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
      getUser.isVerified = true;
      await getUser.save()
      return res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch(error) {
    console.log('error', error);
    return res.status(500).json({error: 'internal server error'
      });
    }
  }

exports.loginUser = async(req, res) => {
  try{
    const getUser = await userRepository.findOneByEmail( req.body.email);
    if(!getUser){
      return res.status(401).json({error: "invalid credential"})
    }
    if (!getUser.isVerified) {
      const createToks = createToken(getUser);
      if (createToks) {
        return res.status(201).json({
          message:
            'Please check your email to validate your account',
        });
      }
      return res.status(400).json({ error: 'Please verify account' });
    }
    const getPasswordMatch = bcrypt.compareSync(req.body.password, getUser.password);
    if(!getPasswordMatch){
      return res.status(401).json({error:"invalid credentials"})
    }
    const token = jwt.sign({ email: getUser.email }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });
    res.status(200).json({
      email: getUser.email,
      firstName: getUser.firstName,
      lastName: getUser.lastName,
      token: token,
    });

  }
    catch(error)
    {
      console.error(error);
      return res.status(500).json({ error: 'internal server error' });

    }
  }

exports.getUser=async (req, res)=>{
  try {
    const getUser = await userRepository.findOne({email: req.user.email});
    if(!getUser){
      return res.status(404).json({error: "User not found"})
    }
    return res.status(201).json({ getUser})
  }
  catch(error){
    console.log("error", error)
    return res.status(500).json({error: "internal server error"})
  }
}

exports.getAllUsers = async(req, res) =>{
  try{
    const getAllUsers = await userRepository.findAll();
    if(!getAllUsers){
      return res.status(404).json({error: "Could not get all users at this time."})
    }
      return res.status(200).json({getAllUsers})
  } catch(error){
    console.log('error', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
}
