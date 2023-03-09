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

const models = require(__dirname + "/models.js");
const Post = models.Post;

const defaultData = require(__dirname + "/defaultData.js");

app.get("/", function (req, res) {
  Post.find({}, function (err, docs) {
    if (err) {
      renderErrorPage(res, err, 500);
    } else {
      res.render("home", {
        title: "Home",
        content: defaultData.homeStartingContent,
        posts: docs,
      });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("post", { title: "About", content: defaultData.aboutContent });
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
  res.render("post", {
    title: "Contact",
    content: defaultData.contactContent,
  });
});

// HTTPS config
const httpsPort = process.env.HTTPS_PORT || 443;
const hostname = process.env.HOST || "localhost";
const fullHttpsUrl = `https://${hostname}:${httpsPort}`;
const httpsServer = https.createServer(
  {
    key: fs.readFileSync("./server.key"),
    cert: fs.readFileSync("./server.cert"),
  },
  app
);

httpsServer.listen(httpsPort, hostname, function () {
  console.log(`HTTPS server started on ${fullHttpsUrl}`);
});

// HTTP config
const httpApp = express();
httpApp.all("*", function (req, res) {
  res.redirect(301, fullHttpsUrl);
});
const httpPort = process.env.HTTP_PORT || 80;
const fullHttpUrl = `http://${hostname}:${httpPort}`;

const httpServer = http.createServer(httpApp);
httpServer.listen(httpPort, hostname, function () {
  console.log(`HTTP  server started on ${fullHttpUrl}`);
});
