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
      `https://openapi.etsy.com/v2/listings/active?api_key=${ETSY_API_KEY}&keywords=morgan+dollar`
    );

    const goodListings = response.data.results
      .filter(goodListingsOnly)
      .map((listing) => {
        return {
          id: listing.listing_id,
          title: listing.title.trim(),
          price: `$${listing.price}`,
          posted: new Date(listing.original_creation_tsz * 1000),
          url: listing.url,
        };
      });

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
          console.log(listing);
          await sendTelegram(listing)
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

cron.schedule("*/30 * * * * *", () => {
  console.log("checkig for new listings...");
  getListings();
});
