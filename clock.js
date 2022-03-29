import axios from "axios";
import cron from "node-cron";

import { isNew } from "./firebase.js";
import { sendTelegram } from "./telegram.js";

import * as dotenv from "dotenv";
dotenv.config();

const ETSY_API_KEY = process.env.ETSY_API_KEY;

const getListings = async () => {
  try {
    const response = await axios.get(
      `https://api.etsy.com/v3/application/listings/active?keywords=morgan+dollar`,
      { headers: { "x-api-key": ETSY_API_KEY } }
    );

    const goodListings = response.data.results
      .filter(goodListingsOnly)
      .map(formatListing);

    let newListings = 0;
    for (let i = 0; i < goodListings.length; i++) {
      const listing = goodListings[i];

      const d = new Date();
      const YYYY = d.getFullYear();
      const MM = d.getMonth() + 1;
      const DD = d.getDate();

      const dateKey = `${YYYY}/${MM}/${DD}`;

      if (await isNew(dateKey, listing.id)) {
        newListings++;
        console.log("new listing!");
        try {
          console.log("sending telegram");
          await sendTelegram(listing);
        } catch (error) {
          console.error(error);
        }
      }
    }
    console.log(`${newListings} new listings`);
  } catch (error) {
    console.error(error);
  }
};

export const goodListingsOnly = (listing) => {
  const title = listing.title.toLowerCase();
  const description = listing.description.toLowerCase();

  const filterOut = [
    "hobo",
    "2021",
    "jewelry",
    "ring",
    "replica",
    "pendant",
    "ring",
    "biker",
    "restrike",
  ];

  return !filterOut.some((forbiddenWord) => {
    return title.includes(forbiddenWord) || description.includes(forbiddenWord);
  });
};

const formatListing = (listing) => {
  // Create our number formatter
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: listing.price.currency_code,
  });

  const price = formatter.format(listing.price.amount / listing.price.divisor);

  const status =
    listing.original_creation_timestamp === listing.creation_timestamp
      ? "New Listing"
      : "Listing Updated";

  const title = listing.title.trim();
  const clickableTitle = `[${title}](${listing.url})`;

  return {
    id: listing.listing_id,
    status,
    title: clickableTitle,
    price,
    posted: new Date(
      listing.original_creation_timestamp * 1000
    ).toLocaleString(),
  };
};

cron.schedule("*/10 * * * * *", () => {
  console.log("checking for new listings...");
  getListings();
});
