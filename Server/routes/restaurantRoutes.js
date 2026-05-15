import express from "express";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// ---- Server-side validation helpers ----
// Centralised validation so create/update share the same business rules.
const validateRestaurantInput = ({ name, rating, lat, lng }) => {
  if (!name || typeof name !== "string" || name.trim() === "") {
    return "Restaurant name is required";
  }
  if (rating !== undefined && rating !== "") {
    const r = Number(rating);
    if (isNaN(r) || r < 1 || r > 5) return "Rating must be between 1 and 5";
  }
  if (lat !== undefined && lat !== "") {
    const l = Number(lat);
    if (isNaN(l) || l < -90 || l > 90) return "Latitude must be between -90 and 90";
  }
  if (lng !== undefined && lng !== "") {
    const l = Number(lng);
    if (isNaN(l) || l < -180 || l > 180) return "Longitude must be between -180 and 180";
  }
  return null;
};

// ---- Server-side calculation ----
// Computes the average meal price across all meals on a restaurant.
// Called before save so the stored value stays in sync.
const calculateAverageMealPrice = (meals = []) => {
  if (!Array.isArray(meals) || meals.length === 0) return 0;
  const total = meals.reduce((sum, m) => sum + (Number(m.price) || 0), 0);
  return Number((total / meals.length).toFixed(2));
};

// @route   GET /api/restaurants
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/restaurants/:id
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: "Restaurant not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/restaurants
router.post("/", async (req, res) => {
  try {
    const { name, category, image, description, location, services, rating, lat, lng, isOpen } = req.body;

    // ----- Server-side validation -----
    const validationError = validateRestaurantInput({ name, rating, lat, lng });
    if (validationError) return res.status(400).json({ message: validationError });

    const restaurant = await Restaurant.create({
      name,
      category,
      image,
      description,
      location,
      lat: lat ? Number(lat) : 0,
      lng: lng ? Number(lng) : 0,
      services: services || ["dine-in"],
      meals: [],
      rating: rating ? Number(rating) : 0,
      isOpen: typeof isOpen === "boolean" ? isOpen : true,
      averageMealPrice: 0, // no meals yet
    });
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/restaurants/:id
router.delete("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant) {
      await restaurant.deleteOne();
      res.json({ message: "Restaurant removed" });
    } else {
      res.status(404).json({ message: "Restaurant not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/restaurants/:id
router.put("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const { name, category, image, description, location, services, rating, lat, lng, isOpen } = req.body;

    // ----- Server-side validation -----
    const validationError = validateRestaurantInput({ name, rating, lat, lng });
    if (validationError) return res.status(400).json({ message: validationError });

    restaurant.name = name || restaurant.name;
    restaurant.category = category || restaurant.category;
    restaurant.image = image !== undefined ? image : restaurant.image;
    restaurant.description = description !== undefined ? description : restaurant.description;
    restaurant.location = location || restaurant.location;
    restaurant.lat = lat !== undefined && lat !== "" ? Number(lat) : restaurant.lat;
    restaurant.lng = lng !== undefined && lng !== "" ? Number(lng) : restaurant.lng;
    restaurant.services = services || restaurant.services;
    restaurant.rating = rating !== undefined && rating !== "" ? Number(rating) : restaurant.rating;
    if (typeof isOpen === "boolean") restaurant.isOpen = isOpen;

    const updatedRestaurant = await restaurant.save();
    res.json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/restaurants/:id/meals
router.post("/:id/meals", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const { name, price, category, image } = req.body;

    // Server-side meal validation
    if (!name || price === undefined || price === "") {
      return res.status(400).json({ message: "Meal name and price are required" });
    }
    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    restaurant.meals.push({ name, price: priceNum, category, image });

    // Server-side calculation — keep averageMealPrice in sync
    restaurant.averageMealPrice = calculateAverageMealPrice(restaurant.meals);

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/restaurants/:id/meals/:mealId
router.put("/:id/meals/:mealId", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const meal = restaurant.meals.id(req.params.mealId);
    if (!meal) return res.status(404).json({ message: "Meal not found" });

    const { name, price, category, image } = req.body;

    if (price !== undefined && price !== "") {
      const priceNum = Number(price);
      if (isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({ message: "Price must be a positive number" });
      }
      meal.price = priceNum;
    }
    if (name) meal.name = name;
    if (category !== undefined) meal.category = category;
    if (image !== undefined) meal.image = image;

    // Recalculate average meal price
    restaurant.averageMealPrice = calculateAverageMealPrice(restaurant.meals);

    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/restaurants/:id/meals/:mealId
router.delete("/:id/meals/:mealId", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    restaurant.meals.pull({ _id: req.params.mealId });

    // Recalculate average meal price after removal
    restaurant.averageMealPrice = calculateAverageMealPrice(restaurant.meals);

    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
