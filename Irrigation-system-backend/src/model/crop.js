const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    humidity: { type: Number, required: true },
    temperature: { type: Number, required: true },
    rain: { type: Number, required: true },
    moisture: { type: Number, required: true },
    fieldNumber: { type: Number, required: true },
    waterStatus: { type: Boolean, required: true },
  },
  { timestamps: true }
); // Add timestamps option

module.exports = mongoose.model("Crop", cropSchema);
