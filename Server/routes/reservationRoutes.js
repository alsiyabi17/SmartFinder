import express from "express";
import Reservation from "../models/Reservation.js";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// Fixed per-seat price used for the estimatedTotal calculation
const PRICE_PER_SEAT = 15;

// @route   GET /api/reservations
// @desc    Get all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find({}).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/reservations
// @desc    Create a reservation (with server-side validation + calculation)
router.post("/", async (req, res) => {
  try {
    const {
      restaurantId,
      customerName,
      customerEmail,
      reservationDate,
      numberOfPeople,
    } = req.body;

    // ----- Server-side validation -----
    if (!restaurantId || !customerName || !customerEmail || !reservationDate || !numberOfPeople) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate party size
    const people = parseInt(numberOfPeople, 10);
    if (isNaN(people) || people < 1 || people > 20) {
      return res.status(400).json({ message: "Number of people must be between 1 and 20" });
    }

    // Validate that the date is not in the past
    const bookingDate = new Date(reservationDate);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return res.status(400).json({ message: "Reservation date cannot be in the past" });
    }

    // Make sure the restaurant exists and is open
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    if (restaurant.isOpen === false) {
      return res.status(400).json({ message: "This restaurant is currently closed" });
    }

    // ----- Server-side calculation (business logic) -----
    // estimatedTotal = people * fixed seat price
    const estimatedTotal = people * PRICE_PER_SEAT;

    const reservation = await Reservation.create({
      restaurantId,
      restaurantName: restaurant.name,
      customerName,
      customerEmail,
      reservationDate: bookingDate,
      numberOfPeople: people,
      confirmed: true,
      estimatedTotal,
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/reservations/:id
// @desc    Cancel a reservation
router.delete("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    await reservation.deleteOne();
    res.json({ message: "Reservation cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
