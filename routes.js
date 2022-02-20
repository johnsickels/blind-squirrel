const axios = require("axios");
const router = require("express").Router();
const scribe = require("./scribe");
const sendSms = require("./sms");

require("dotenv").config();
const API_KEY = process.env.API_KEY;

// confirm api key and etsy app
router.get("/ping", async (_, res) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "x-api-key": API_KEY,
    },
  };

  axios
    .get("https://api.etsy.com/v3/application/openapi-ping", requestOptions)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      if (error.response && error.response.status) {
        return res
          .status(error.response.status)
          .send(
            `From Etsy: ${error.response.status} ${error.response.statusText}`
          );
      }
      return res.status(500).send("From Etsy: " + error);
    });
});

// accept requests from the Etsy PubSub
router.post("/callback", async (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

// sample SMS
router.post("/twilio", (req, res) => {
  sendSms(req.body.message)
    .then((message) => {
      console.log(message.sid);
      res.status(200).send(`Message SID: ${message.sid}`);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// subscribe to pubsub feed
router.get("/subscribe", async (_, res) => {
  await scribe("subscribe")
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res
        .status(error.response.status)
        .send(
          `From Etsy: ${error.response.status} ${error.response.statusText}`
        );
    });
});

// unsubscribe from pubsub feed
router.get("/unsubscribe", async (_, res) => {
  await scribe("unsubscribe")
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res
        .status(error.response.status)
        .send(
          `From Etsy: ${error.response.status} ${error.response.statusText}`
        );
    });
});

// catchall route
router.get("*", (_, res) => {
  res.status(200).send("Hello Squirrels");
});

module.exports = router;
