import { initializeApp } from "firebase/app";
import { child, get, getDatabase, ref, set } from "firebase/database";

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "timeless-currency.firebaseapp.com",
  projectId: "timeless-currency",
  storageBucket: "timeless-currency.appspot.com",
  messagingSenderId: "143465252400",
  appId: "1:143465252400:web:f15ce320d9cb9165334ff5",
  measurementId: "G-RMQHMP4ZDZ",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const acknowledgeListing = async (date, listingId) => {
  try {
    const snapshot = await get(child(ref(db), `listings/${date}`));

    console.log(`acking new listing ${listingId}`);
    if (snapshot.exists()) {
      return set(ref(db, `listings/${date}`), snapshot.val().concat(listingId));
    } else {
      return set(ref(db, `listings/${date}`), [listingId]);
    }
  } catch (error) {
    console.error(error);
  }
};

export const isNew = async (date, listingId) => {
  try {
    const snapshot = await get(child(ref(db), `listings/${date}`));

    if (snapshot.exists() && snapshot.val().includes(listingId)) {
      return false;
    }

    await acknowledgeListing(date, listingId);
    return true;
  } catch (error) {
    console.error(error);
  }
};
