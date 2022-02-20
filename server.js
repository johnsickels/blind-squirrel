// Import the express and axios libraries
const axios = require("axios");
const express = require("express");

require("dotenv").config();

const API_KEY = process.env.API_KEY;

// Create a new express application
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Send a JSON response to a default get request
app.get("/ping", async (req, res) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "x-api-key": API_KEY,
    },
  };

  const response = await axios.get(
    "https://api.etsy.com/v3/application/openapi-ping",
    requestOptions
  );

  if (response.ok) {
    const data = await response.json();
    res.send(data);
  } else {
    res.status(response.status).send("From Etsy: " + response.statusText);
  }
});

// Accept requests from the Etsy PubSub
app.post("/callback", async (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

// Start the server on port 3003
const port = 3003;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
