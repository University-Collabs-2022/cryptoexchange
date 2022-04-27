const express = require("express");
const server = express();

server.use(express.json());

server.post("/api/addCrypto", async (req, res) => {
  const { username, password } = req.body;

});

module.exports = server;
