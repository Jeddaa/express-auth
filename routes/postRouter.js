const router = require('express').Router();
const controller = require('../post.controller');
const middleware = require('../middleware');
const { CreatePostDto } = require('../dto');

const validator = require('express-joi-validation').createValidator({});

router.post(
  '/create-post',
  validator.body(CreatePostDto),
  middleware.authenticateMiddleware,
  controller.createPost,
);

router.get(
  '/all-posts',
  controller.getAllPost,
);

router.get(
  '/all-authors',
  middleware.authenticateMiddleware,
  controller.getAllAuthors,
);

router.get(
  '/:postId',
  middleware.authenticateMiddleware,
  controller.getOnePost,
);

router.get(
  '/author/:authorId',
  middleware.authenticateMiddleware,
  controller.getAllPostByAuthor,
);

module.exports = router
