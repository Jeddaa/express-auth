// validate.js
const { plainToInstance } = require('class-transformer');
const { validate } = require('class-validator');

exports.validateDtoMiddleware = (dtoClass) => {
  return async (req, res, next) => {
    const dtoObject = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoObject);
    console.log("errors in middleware", errors)

    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints))
        .flat();
      return res.status(400).json({ errors: errorMessages });
    }

    req.body = dtoObject;
    next();
  };
}
// exports.authenticateMiddleware = (user)=>{
//   return async (req, res, next)=>{
//     const token = req.header.authorization;
//     if(token){
//       jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
//         if(err){
//           return res.sendStatus(403)
//         }
//         req.user = user
//         next();
//       });
//     } else {
//       return res.sendStatus(401)
//     }
//   }
// }
exports.authenticateMiddleware = (res, req, next)=>{
  const token = req.header.authorization
  if(!token){
    return res.sendStatus(401);
  }
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  })
}
