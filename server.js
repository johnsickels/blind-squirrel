// Import the express and axios libraries
const axios = require("axios");
const { response } = require("express");
const express = require("express");
const scribe = require("./scribe");

require("dotenv").config();

const API_KEY = process.env.API_KEY;

// Create a new express application
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Send a JSON response to a default get request
app.get("/ping", async (_, res) => {
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

app.get("/subscribe", async (_, res) => {
  try {
    const response = await scribe("subscribe");
    res.send(response);
  } catch (error) {
    res.status(500).send("From Etsy: " + error);
  }
});

app.get("/unsubscribe", async (_, res) => {
  try {
    const response = await scribe("unsubscribe");
    res.send(response);
  } catch (error) {
    res.status(500).send("From Etsy: " + error);
  }
});

app.get("*", (_, res) => {
  res.status(200).send("Hello Squirrels");
});

// Start the server on port 3003
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
