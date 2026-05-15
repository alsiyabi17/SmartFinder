import dotenv from "dotenv";
import Reservation from "./models/Reservation.js";
import Restaurant from "./models/Restaurant.js";
import connectDB from "./config/db.js";

dotenv.config();

const PRICE_PER_SEAT = 15;

// 5+ reservations, attached to the first few restaurants in the DB.
const seedReservations = async () => {
  await connectDB();

  const restaurants = await Restaurant.find({});
  if (restaurants.length === 0) {
    console.error("⚠️  No restaurants found — run `node seedRestaurants.js` first.");
    process.exit(1);
  }

  // Clear existing reservations so this is idempotent
  await Reservation.deleteMany({});
  console.log("Cleared existing reservations.");

  // Generate 6 reservations across the first restaurants
  const sample = [
    { name: "Ali Al Balushi", email: "ali@example.com", offsetDays: 2, people: 4 },
    { name: "Sara Al Lawati", email: "sara@example.com", offsetDays: 5, people: 2 },
    { name: "Khalid Al Harthy", email: "khalid@example.com", offsetDays: 7, people: 6 },
    { name: "Maryam Al Habsi", email: "maryam@example.com", offsetDays: 1, people: 3 },
    { name: "Yousef Al Rashdi", email: "yousef@example.com", offsetDays: 10, people: 8 },
    { name: "Noor Al Saidi", email: "noor@example.com", offsetDays: 3, people: 2 },
  ];

  const docs = sample.map((s, i) => {
    const restaurant = restaurants[i % restaurants.length];
    const reservationDate = new Date();
    reservationDate.setDate(reservationDate.getDate() + s.offsetDays);

    return {
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      customerName: s.name,
      customerEmail: s.email,
      reservationDate,
      numberOfPeople: s.people,
      confirmed: true,
      estimatedTotal: s.people * PRICE_PER_SEAT,
    };
  });

  await Reservation.insertMany(docs);
  console.log(`✅ Inserted ${docs.length} reservations.`);
  process.exit(0);
};

seedReservations().catch((err) => {
  console.error(err);
  process.exit(1);
});
