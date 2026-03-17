import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date },
  host: { type: String, default: "Unknown Host" },
  location: { type: String, default: "Unknown Location" },
  price: { type: String, default: "Free" },
  image: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
