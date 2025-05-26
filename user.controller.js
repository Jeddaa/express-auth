const userRepository = require('./repository')
const tokenRepository = require('./token.repository')
const sendEmail = require('./utils')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const crypto = require('crypto');


// const createToken = (userEmail)=>{
//   try {
//     const token = jwt.sign({ email: userEmail }, process.env.SECRET_KEY);
//     res.status(200).json({ token });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }
exports.createUser = async (req, res) => {
    try {
      const existingUser = await userRepository.findOneByEmail( req.body.email );
      if (existingUser) {
        return res.status(400).json({ error: 'email address already in use' });
      }
      const hashed = bcrypt.hashSync(req.body.password, 10)
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpires = Date.now() + 3600000; // 1 hour
      const newUser = await userRepository.create({
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashed,
        isVerified: false,
      });
      const createToken = await tokenRepository.create({
        userId: newUser._id,
        verificationToken: verificationToken,
        verificationTokenExpires: verificationTokenExpires
      })
      if(newUser){
        // const token = jwt.sign({ email: newUser.email }, process.env.SECRET_KEY);
        if (createToken) {
          const verificationLink = `http://localhost:3000/api/auth/verify/${newUser._id}/${createToken.verificationToken}`;
          sendEmail(
            newUser.email,
            'Account Verification',
            `<p>Please verify your email by clicking the link: <a href="${verificationLink}">Verify Email</a></p>`,
          );
        } else {
          return res.status(400).send('token not created');
        }
        // res.status(200).json({ token });
      return res
        .status(201)
        .json({
          message:
            'Registration successful. Please check your email to validate your account',
        });

      }
    } catch(error){
      res.status(500).json({error: 'internal server error'
      });
        console.log("error", error);
    }
  }

  exports.verifyUser = async(req, res)=>{
    try{
      const userId = new mongoose.Schema.Types.ObjectId(req.params.userId);
      const token = req.params.token
      const getToken = await tokenRepository.findOneByUserId({userId: userId, verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });
      if(!getToken) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
      const getUser = await userRepository.findOneByUserId(userId)
      getUser.isVerified = true;
      await getUser.save()
      res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch(error){
    res.status(500).json({error: 'internal server error'
      });
        console.log("error", error);
    }
  }

  exports.loginUser = async(req, res) => {
    try{
      const getUser = await userRepository.findOneByEmail({email: req.body.email});
      if(!getUser){
        return res.status(401).json({error: "invalid credentials"})
      }
      const getPasswordMatch = bcrypt.compareSync(req.body.password, getUser.password);
      if(getPasswordMatch != req.body.password){
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
      res.status(500).json({ error: 'internal server error' });
    }
  }

  exports.getUser=async (req, res)=>{
    try{
    const getUser = await userRepository.findOneByEmail({
      email: req.user.email,
    });
    if(!getUser){
      return res.status(404).json({error: "User not found"})
    }
    const { password, ...userWithoutPassword } = getUser;
    return res.status(201).json({ ...userWithoutPassword });

  }
  catch(error){
    return res.status(500).json({error: "internal server error"})
  }
}
