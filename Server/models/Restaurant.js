import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: "" },
  image: { type: String, default: "" },
});

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: "" },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    location: { type: String, default: "" },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    services: { type: [String], default: ["dine-in"] },
    meals: [mealSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);