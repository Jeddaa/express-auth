const router = require('express').Router();
const controller = require('./user.controller');
const middleware = require('./middleware');
const { CreateUserDto, LoginDto } = require('./dto');

const validator = require('express-joi-validation').createValidator({});


// to check if the router connection is working.
router.get('/', (req, res) => {
  res.status(200);
  res.send('Welcome to root URL of Server');
});

router.post(
  '/register',
  validator.body(CreateUserDto),
  // middleware.validateDtoMiddleware(CreateUserDto),

  controller.createUser,
);

router.post(
  '/verify/:userid/:token',
  // validator.body(CreateUserDto),
  // middleware.validateDtoMiddleware(CreateUserDto),
  controller.verifyUser,
);

router.post(
  '/login',
  // middleware.validateDtoMiddleware(CreateUserDto),
  validator.body(LoginDto),

  controller.loginUser,
);
router.get(
  '/user',
  middleware.authenticateMiddleware,
  controller.getUser,
);

module.exports = router;
