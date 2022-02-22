import axios from "axios";
import cron from "node-cron";
import * as dotenv from "dotenv";
import { isNew } from "./firebase.js";
import { sendSms } from "./sms.js";
dotenv.config();

const ETSY_API_KEY = process.env.ETSY_API_KEY;

const getListings = async () => {
  try {
    const response = await axios.get(
      `https://openapi.etsy.com/v2/listings/active?api_key=${ETSY_API_KEY}&keywords=morgan+dollar,pcgs,ngc`
    );

    const goodListings = response.data.results
      .filter((listing) => {
        const title = listing.title.toLowerCase();

        const filterOut = [
          "hobo",
          "2021",
          "jewelry",
          "ring",
          "replica",
          "pendant",
          "ring",
          "biker",
        ];

        return !filterOut.some((forbiddenWord) => {
          return title.includes(forbiddenWord);
        });
      })
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
        console.log("New listing!");
        try {
          await sendSms(listing);
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

cron.schedule("*/30 * * * * *", () => {
  console.log("checkig for new listings...");
  getListings();
});
