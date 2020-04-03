const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");
router.post("/register", validInfo, async (req, res) => {
  try {
    // destructuring the req.body
    const { name, email, password } = req.body;

    // getting the user in the database
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email
    ]);

    // checking if user email is already in databasae
    if (user.rows.length !== 0) {
      return res.status(401).json("user already exist ");
    }

    // encrypting password to send to database
    const saltRound = 10;
    const salt = await bcrypt.genSalt();
    const bycrptPassword = await bcrypt.hash(password, salt);

    // entering the user into the database
    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bycrptPassword]
    );

    // getting a token from the user_id
    const token = jwtGenerator(newUser.rows[0].user_id);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// login route

router.post("/login", validInfo, async (req, res) => {
  try {
    // destructuring user credential
    const { email, password } = req.body;

    // getting user from database
    const user = await pool.query(
      "SELECT * FROM users WHERE user_email = $1 ",
      [email]
    );

    // checking if such user exist in the database
    if (user.rows.length == 0) {
      return res.status(401).json("password or email is incorrect ");
    }

    // comparing the encryted password with the one the user is providing
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    // invalid password error message
    if (!validPassword) {
      return res.status(401).json("password or email is incorrect");
    }

    // getting token from user_id
    const token = jwtGenerator(user.rows[0].user_id);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
