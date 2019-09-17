const express = require("express");

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const PostController = require('../controllers/posts');

const router = express.Router();


// functions are executed from left to right
router.post(
  "",
checkAuth,
extractFile,
PostController.createPost
);

router
.put(
  "/:id",
  checkAuth,
  extractFile,
  PostController.updatePost
);

router.get(
  "",
  PostController.getPosts
  );

router.get(
  "/:id",
  PostController.getPost
  );

router.get(
  "/:address",
  PostController.findPosts
  );

router.delete(
  "/:id",
  checkAuth,
  PostController.deletePost
  );

module.exports = router;
