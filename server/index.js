const express = require("express");

const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());

// ROUTES

//register and login routes

app.use("/auth", require("./routes/jwtAuth"));

// posts route

app.use("/posts", require("./routes/posts"));

// username route
app.use("/username", require("./routes/username"));

PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  try {
    console.log(`server now on port: ${PORT}`);
  } catch (err) {
    console.error(err);
  }
});
