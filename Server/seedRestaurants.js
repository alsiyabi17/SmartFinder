import dotenv from "dotenv";
import Restaurant from "./models/Restaurant.js";
import connectDB from "./config/db.js";

dotenv.config();

// 5+ Muscat restaurants with real coordinates so the Google Maps embed works.
const restaurants = [
  {
    name: "Bait Al Luban",
    category: "Omani",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    description:
      "Authentic Omani cuisine in a traditional setting overlooking Muttrah Corniche.",
    location: "Muttrah",
    lat: 23.6175,
    lng: 58.5917,
    rating: 4.6,
    services: ["dine-in"],
    isOpen: true,
    meals: [
      { name: "Shuwa", price: 18, category: "Main", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400" },
      { name: "Omani Halwa", price: 6, category: "Dessert", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400" },
      { name: "Kabsa", price: 14, category: "Main", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400" },
    ],
  },
  {
    name: "Kargeen Cafe",
    category: "Mediterranean",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    description:
      "Open-air garden cafe with shisha, Arabic mezze and a relaxed vibe.",
    location: "Madinat Qaboos",
    lat: 23.5933,
    lng: 58.4467,
    rating: 4.4,
    services: ["dine-in", "delivery"],
    isOpen: true,
    meals: [
      { name: "Hummus Platter", price: 7, category: "Starter", image: "https://images.unsplash.com/photo-1574484184081-afea8a62f9b6?w=400" },
      { name: "Mixed Grill", price: 22, category: "Main", image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400" },
    ],
  },
  {
    name: "Ubhar",
    category: "Omani Fusion",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    description:
      "Modern Omani fusion dishes with international techniques.",
    location: "Bareeq Al Shatti",
    lat: 23.6133,
    lng: 58.4683,
    rating: 4.7,
    services: ["dine-in"],
    isOpen: true,
    meals: [
      { name: "Frankincense Ice Cream", price: 9, category: "Dessert", image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400" },
      { name: "Camel Burger", price: 17, category: "Main", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },
    ],
  },
  {
    name: "Bin Ateeq",
    category: "Omani",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    description: "Traditional Omani dining in private majlis-style rooms.",
    location: "Al Khuwair",
    lat: 23.5917,
    lng: 58.4117,
    rating: 4.2,
    services: ["dine-in", "delivery"],
    isOpen: true,
    meals: [
      { name: "Maqbous", price: 11, category: "Main", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400" },
      { name: "Mashuai", price: 16, category: "Main", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400" },
    ],
  },
  {
    name: "The Restaurant at The Chedi",
    category: "Fine Dining",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    description: "Award-winning fine dining with four open show kitchens.",
    location: "Al Ghubra",
    lat: 23.6233,
    lng: 58.4533,
    rating: 4.9,
    services: ["dine-in"],
    isOpen: true,
    meals: [
      { name: "Lobster Thermidor", price: 45, category: "Main", image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400" },
      { name: "Wagyu Steak", price: 60, category: "Main", image: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400" },
      { name: "Crème Brûlée", price: 12, category: "Dessert", image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400" },
    ],
  },
  {
    name: "Pizza Muscat",
    category: "Italian",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800",
    description: "Wood-fired Neapolitan pizzas and homemade pasta.",
    location: "Qurum",
    lat: 23.6133,
    lng: 58.4767,
    rating: 4.3,
    services: ["dine-in", "delivery"],
    isOpen: false, // demonstrates the Boolean field
    meals: [
      { name: "Margherita", price: 8, category: "Pizza", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400" },
      { name: "Carbonara", price: 12, category: "Pasta", image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400" },
    ],
  },
];

// Helper to compute averageMealPrice from meals — mirrors the server logic
const calcAverage = (meals = []) => {
  if (!meals.length) return 0;
  const total = meals.reduce((s, m) => s + Number(m.price || 0), 0);
  return Number((total / meals.length).toFixed(2));
};

const seedRestaurants = async () => {
  await connectDB();

  // Clear existing restaurants so this is idempotent
  await Restaurant.deleteMany({});
  console.log("Cleared existing restaurants.");

  // Set averageMealPrice on each restaurant before inserting
  const withAverages = restaurants.map((r) => ({
    ...r,
    averageMealPrice: calcAverage(r.meals),
  }));

  await Restaurant.insertMany(withAverages);
  console.log(`✅ Inserted ${withAverages.length} restaurants.`);
  process.exit(0);
};

seedRestaurants().catch((err) => {
  console.error(err);
  process.exit(1);
});
