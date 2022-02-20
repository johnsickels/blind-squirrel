// from pprint import pprint
// from time import time
// import sys
// import urllib
// import urllib2

const { default: axios } = require("axios");

// API_KEY = 'your-feed-key'  # Replace with your /v2/feeds key
const API_KEY = process.env.API_KEY;

// # You can also pass in a different valid feed like http://www.etsy.com/api/push/shops/etsyshop/listings/latest.atom as a parameter
// FEED_URL = 'http://www.etsy.com/api/push/listings/latest.atom'   # Default feed
const feedUrl = "http://www.etsy.com/api/push/listings/latest.atom";

// CALLBACK_URL = 'https://your-url.com/callback'  # Callback url for the hub to send pings to
const callbackUrl = "https://blind-squirrel-coins.herokuapp.com/callback";

// HUB_URL = 'https://etsy.superfeedr.com'
const hubUrl = "https://etsy.superfeedr.com";

params = {
  "hub.mode": "subscribe", // subscribe | unsubscribe from a feed
  "hub.verify": "sync", // Whether the subscribe request is verified prior to returning or at a later time
  "hub.callback": callbackUrl, // The callback url on your PuSH subscriber server
  "hub.topic": feedUrl, // The feed you want to subscribe to
  api_key: API_KEY, // Not standard PuSH, passed to Etsy to verify you are authorized subscribe to this feed
  time_stamp: Date.now(),
};

// def scribe(params, mode=None, topic=None):
const scribe = (params, mode) => {
  //     headers = {}
  //   const headers = {}
  //     if mode:
  //         params['hub.mode'] = mode
  params["hub.mode"] = mode;
  //     if topic:
  //         params['hub.topic'] = topic
  //   params['hub.topic'] = topic
  //     try:
  try {
    axios.post(hubUrl, { data: params });

    //         request = urllib2.Request(HUB_URL, data=urllib.urlencode(params), headers=headers)
    //         print urllib.urlencode(params)
    //         response = urllib2.urlopen(request)
    //         return response
  } catch (error) {}
  //     except Exception as e:
  //         print 'Problem with the request.'
  //         pprint(e)
};

// if __name__ == '__main__':
//     # Usage: python scribe.py [subscribe|unsubscribe] [feed_url]
//     # Default is subscribe
//     mode = 'subscribe'
//     topic = FEED_URL
//     if len(sys.argv) >= 2:
//         mode = sys.argv[1]
//         if len(sys.argv) >= 3:
//             topic = sys.argv[2]

const mode = process.argv[2] || "subscribe";
scribe(params, mode);
