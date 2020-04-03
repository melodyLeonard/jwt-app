const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// getting all posts
router.post("/", authorization, async (req, res) => {
  try {
    const { post_title, post_body, post_author_id } = req.body;
    if (!post_title) {
      res.status(401).json({ message: "please include a title" });
    } else if (!post_body) {
      res.status(401).json({ message: "you can't create an empty post" });
    } else if (!post_author_id) {
      res.status(401).json({ message: "post must have a user" });
    } else {
      const newPost = await pool.query(
        "INSERT INTO posts (post_title, post_body, post_author_id) VALUES($1, $2, $3) RETURNING *",
        [post_title, post_body, post_author_id]
      );
      res.json(newPost.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// get all todo (get method)
router.get("/", authorization, async (req, res) => {
  try {
    const allPosts = await pool.query("SELECT * FROM posts");
    res.json(allPosts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// get a single todo

router.get("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await pool.query("SELECT * FROM posts WHERE post_id = $1", [
      id
    ]);
    res.json(post.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// edit a single todo (Put method)

router.put("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const { post_title, post_body } = req.body;
    const updatePost = await pool.query(
      "UPDATE posts SET post_title = $1 SET post_body = $2 WHERE post_id = $3",
      [post_title, post_body, id]
    );
    res.json("post updated");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// delete a single todo (delete method)

router.delete("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const deletePost = await pool.query(
      "DELETE FROM posts WHERE post_id = $1",
      [id]
    );
    res.json("post deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
