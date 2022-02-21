const axios = require("axios");

const scribe = (mode) => {
  const API_KEY = process.env.API_KEY;

  const hubUrl = "https://etsy.superfeedr.com";

  // You can also pass in a different valid feed like http://www.etsy.com/api/push/shops/etsyshop/listings/latest.atom as a parameter or
  const feedUrl = "http://www.etsy.com/api/push/listings/latest.atom"; // default feed

  // Callback url for the hub to send pings to
  const callbackUrl = "https://blind-squirrel.herokuapp.com/callback";

  const params = {
    "hub.mode": mode, // subscribe | unsubscribe from a feed
    "hub.verify": "sync", // Whether the subscribe request is verified prior to returning or at a later time
    "hub.callback": callbackUrl, // The callback url on your PuSH subscriber server
    "hub.topic": feedUrl, // The feed you want to subscribe to
    api_key: API_KEY, // Not standard PuSH, passed to Etsy to verify you are authorized subscribe to this feed
    time_stamp: Date.now(),
  };

  return axios.post(hubUrl, { data: params });
};

module.exports = scribe;
