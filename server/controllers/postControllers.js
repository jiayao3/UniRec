const { Post } = require("../models/post");

const addNewPost = async (req, res, next) => {
  try {
    // create new post from req
    const newPost = await new Post(req.body);
    await newPost.save();

    // send new post
    return await res.send(newPost);
  } catch (e) {
    // send error
    console.error(e);
    return res.send(e);
  }
};

// get a post from their objectID
const getPost = async (req, res, next) => {
  try {
    // retrieve object id of user from request
    let postID = req.body._id;

    // find the user in the database
    let exists = await Post.findOne({ _id: postID });
    if (exists) {
      return res.send(exists);
    }
    // user not found
    return res.send("post does not exist");
  } catch (e) {
    console.error(e);
    return res.send(e);
  }
};

module.exports = { addNewPost, getPost };