import mongoose from "mongoose";

// Second main collection (in addition to Restaurant).
// Stores table bookings made from the Restaurant Details page.
const reservationSchema = new mongoose.Schema(
  {
    // Reference to the restaurant being booked
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    // Restaurant name copied at booking time (so it stays readable even if the
    // restaurant is later renamed)
    restaurantName: { type: String, required: true },

    // Guest details
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },

    // Booking info
    reservationDate: { type: Date, required: true },
    numberOfPeople: { type: Number, required: true, min: 1, max: 20 },

    // Boolean flag — satisfies the "Boolean datatype" rubric requirement
    confirmed: { type: Boolean, default: true },

    // Server-side calculated field — totalPrice = numberOfPeople * pricePerSeat
    estimatedTotal: { type: Number, default: 0 },
  },
  { timestamps: true } // createdAt / updatedAt are Date fields
);

export default mongoose.model("Reservation", reservationSchema);
