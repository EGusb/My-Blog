const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const dbFullPath = `${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
console.log(`Database path: ${dbFullPath}`);
mongoose.connect(dbFullPath);

const postSchema = {
  title: {
    type: String,
    required: [true, "The post must have a title!"],
  },
  body: {
    type: String,
    required: [true, "The post must have a body!"],
  },
};

exports.Post = mongoose.model("Post", postSchema);
