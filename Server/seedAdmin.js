import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();

const seedAdmin = async () => {
  await connectDB();

  const existing = await User.findOne({ email: "admin@gmail.com" });
  if (existing) {
    console.log("Admin already exists — skipping.");
    process.exit(0);
  }

  await User.create({
    name: "Admin",
    firstName: "Admin",
    lastName: "",
    email: "admin@gmail.com",
    password: "admin123",
  });

  console.log("✅ Admin user created: admin@gmail.com / admin123");
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
