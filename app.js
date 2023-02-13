require("dotenv").config();

const http = require("http");
const https = require("https");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true })); // Required to parse requests
app.use(express.static("public"));

const data = require(__dirname + "/exampleData.js");

let posts = data.posts;
let postId = data.postId;

app.get("/", function (req, res) {
  res.render("home", {
    title: "Home",
    content: data.homeStartingContent,
    posts: posts,
  });
});

app.get("/about", function (req, res) {
  res.render("about", { title: "About", content: data.aboutContent });
});

app.get("/posts/:postId", function (req, res) {
  post = posts.find(function (post) {
    return post.postId === Number(req.params.postId);
  });

  if (post) {
    res.render("post", { title: post.title, content: post.body });
  } else {
    res.redirect("/");
  }
});

app.get("/compose", function (req, res) {
  res.render("compose", { title: "Compose" });
});

app.post("/compose", function (req, res) {
  postId += 1;

  posts.push({
    postId: postId,
    title: req.body.postTitle,
    body: req.body.postBody,
  });

  res.redirect("/");
});

app.get("/contact", function (req, res) {
  res.render("contact", { title: "Contact", content: data.contactContent });
});

const hostname = process.env.HOST || "localhost";

// HTTP config
const http_port = process.env.HTTP_PORT || 80;
const http_server = http.createServer(app);

// HTTPS config
const options = {
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.cert"),
};
const https_port = process.env.HTTPS_PORT || 443;
const https_server = https.createServer(options, app);

http_server.listen(http_port, hostname, function () {
  console.log(`HTTP server started on http://${hostname}:${http_port}`);
});

https_server.listen(https_port, hostname, function () {
  console.log(`HTTPS server started on https://${hostname}:${https_port}`);
});
