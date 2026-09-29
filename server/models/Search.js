const mongoose = require("mongoose");

const searchSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    required: true,
  },
  latitude: Number,
  longitude: Number,
  searchedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Search", searchSchema);