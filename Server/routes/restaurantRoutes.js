import express from "express";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// @route   GET /api/restaurants
// @desc    Get all restaurants
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/restaurants/:id
// @desc    Get single restaurant
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
// @desc    Create a restaurant (public for admin frontend)
router.post("/", async (req, res) => {
  try {
    const { name, category, image, description, location, services, rating, lat, lng } = req.body;
    const restaurant = await Restaurant.create({
      name,
      category,
      image,
      description,
      location,
      lat: lat || 0,
      lng: lng || 0,
      services: services || ["dine-in"],
      meals: [],
      rating: rating || 0,
    });
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/restaurants/:id
// @desc    Delete a restaurant (public for admin frontend)
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
// @desc    Update a restaurant (public for admin frontend)
router.put("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant) {
      const { name, category, image, description, location, services, rating, lat, lng } = req.body;
      
      restaurant.name = name || restaurant.name;
      restaurant.category = category || restaurant.category;
      restaurant.image = image !== undefined ? image : restaurant.image;
      restaurant.description = description !== undefined ? description : restaurant.description;
      restaurant.location = location || restaurant.location;
      restaurant.lat = lat !== undefined ? lat : restaurant.lat;
      restaurant.lng = lng !== undefined ? lng : restaurant.lng;
      restaurant.services = services || restaurant.services;
      restaurant.rating = rating !== undefined ? rating : restaurant.rating;

      const updatedRestaurant = await restaurant.save();
      res.json(updatedRestaurant);
    } else {
      res.status(404).json({ message: "Restaurant not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/restaurants/:id/meals
// @desc    Add a meal to a restaurant (public for admin frontend)
router.post("/:id/meals", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const { name, price, category, image } = req.body;
    restaurant.meals.push({ name, price, category, image });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/restaurants/:id/meals/:mealId
// @desc    Edit a meal (public for admin frontend)
router.put("/:id/meals/:mealId", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const meal = restaurant.meals.id(req.params.mealId);
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }
    const { name, price, category, image } = req.body;
    if (name) meal.name = name;
    if (price !== undefined) meal.price = price;
    if (category !== undefined) meal.category = category;
    if (image !== undefined) meal.image = image;
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/restaurants/:id/meals/:mealId
// @desc    Delete a meal (public for admin frontend)
router.delete("/:id/meals/:mealId", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    restaurant.meals.pull({ _id: req.params.mealId });
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
