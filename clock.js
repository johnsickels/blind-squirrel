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
      `https://openapi.etsy.com/v2/listings/active?api_key=${ETSY_API_KEY}&keywords=morgan+dollar`
    );

    const goodListings = response.data.results
      .filter((listing) => {
        return (
          listing.title.toLowerCase().includes("morgan dollar") ||
          listing.title.toLowerCase().includes("pcgs") ||
          (listing.title.toLowerCase().includes("ngc") &&
            !listing.title.toLowerCase().includes("hobo") &&
            !listing.title.toLowerCase().includes("jewelry") &&
            !listing.title.toLowerCase().includes("replica") &&
            !listing.title.toLowerCase().includes("pendant") &&
            !listing.title.toLowerCase().includes("ring") &&
            !listing.title.toLowerCase().includes("biker"))
        );
      })
      .map((listing) => {
        return {
          id: listing.listing_id,
          title: listing.title,
          price: listing.price,
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

cron.schedule("* * * * *", () => {
  console.log("checkig for new listings...");
  getListings();
});
