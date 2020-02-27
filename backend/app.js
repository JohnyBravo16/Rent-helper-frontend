const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path')

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

// MongoDB connection
 mongoose.connect("mongodb+srv://Johny:Wiedzmin20@cluster0-y5zax.mongodb.net/rent-helper?retryWrites=true&w=majority")
  .then(() => {
    console.log('Successfully connected to database');
  })
  .catch(() => {
    console.log('Could not connect to database');
  })

app.use(bodyParser.json());
// parse url encoded data
app.use(bodyParser.urlencoded({ extended: false}));
// used to safe pathing
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
  next();
});

// filtered use of routes
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

//EuKFOqLJbUsgzQFI

module.exports = app;
