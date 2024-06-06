const config = require("./config/config");

const PORT = config.app.port;




require("./config/db");
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const Blogs = require("./models/blogs.model");

const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRouters");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.join(__dirname, "public")));


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blogs.find({});
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
