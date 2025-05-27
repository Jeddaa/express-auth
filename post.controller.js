const mongoose = require("mongoose")
const postRepository = require('./post.respository')
const userRepository = require('./repository');

exports.createPost = async(req, res) =>{
  const getUser = await userRepository.findOneByEmail(req.user.email)
  const title = req.body.title;
  const description = req.body.description;
  const createPost = await postRepository.create({title: title, description: description, authorId: getUser._id })
  if(createPost) {
    getUser.isAuthor = true;
    getUser.save();
    return res.status(201).json({ createPost });
  }
  return res.status(404).json({ error: "Could not create post at this time" });
}

exports.getAllPost = async (req, res) =>{
  const allPost = await postRepository.findPostsAndAuthor()
  if(allPost){
    return res.status(200).json({posts: allPost})
  }
  return res.status(500).json({ error: "cannot get posts at this time. Try again later" });
}

exports.getOnePost = async (req, res) => {
  const postId = mongoose.Types.ObjectId.createFromHexString(req.params.postId);
  const getPost = await postRepository.findOnePostAndAuthor(postId);
  if (!getPost) {
    res.status(400).json({ error: 'Please try again later' });
  }
  res.status(200).json({ post: getPost[0] });
};

exports.getAllAuthors = async (req, res) =>{
  const allAuthors = await userRepository.findAllAuthors();
  if(allAuthors){
    return res.status(200).json({ authors: allAuthors });
  }
    return res
      .status(404)
      .json({ error: 'Could not create find authors at this time' });
}

exports.getAllPostByAuthor = async (req, res) =>{
  const authorId = req.params.authorId;
  const allPosts = await postRepository.findAllByData({
    authorId: mongoose.Types.ObjectId.createFromHexString(authorId),
  });
  if(!allPosts){
    return res.status(400).json({error: "Please try again later"})
  }
  return res.status(200).json({posts: allPosts})
}



