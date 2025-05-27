const router = require('express').Router();
const controller = require('../user.controller');
const middleware = require('../middleware');
const { CreateUserDto, LoginDto } = require('../dto');

const validator = require('express-joi-validation').createValidator({});


// to check if the router connection is working.
router.get('/', (req, res) => {
  res.status(200);
  res.json('Welcome to root URL of Server');
});

router.post(
  '/register',
  validator.body(CreateUserDto),
  controller.createUser,
);

router.post(
  '/verify/:userId/:token',
  controller.verifyUser,
);

router.post(
  '/login',
  validator.body(LoginDto),
  controller.loginUser,
);

router.get(
  '/user',
  middleware.authenticateMiddleware,
  controller.getUser,
);

router.get('/all-users', middleware.authenticateMiddleware, controller.getAllUsers);
module.exports = router;
