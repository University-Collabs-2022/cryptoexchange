const express = require("express");
const Users = require("../models/users.js");
const server = express();

server.use(express.json());

server.post("/api/addFounds", async (req, res) => {
  const { username, password } = req.body;

 
});

server.get("/api/getCurrency", async (req, res) => {
   
  });

module.exports = server;
