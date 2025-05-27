const userRouter = require('./userRouter')
const postRouter = require('./postRouter');
module.exports = (app) => {
  app.use('/api/auth', userRouter);
  app.use('/api/posts', postRouter);
}
