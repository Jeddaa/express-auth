// validate.js
const { plainToInstance } = require('class-transformer');
const { validate } = require('class-validator');
const jwt = require('jsonwebtoken');

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

exports.authenticateMiddleware = (req, res, next)=>{
  const getToken = req.headers['authorization'];
  if (!getToken || !getToken.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = getToken.split(' ')[1];

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.log("error", err)
      return res.status(404).json({ error: 'Please log in and try again' });
    }
    req.user = user;
    next();
  })
}
