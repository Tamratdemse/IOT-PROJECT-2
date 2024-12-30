const express = require("express");
const Crop = require("../model/crop"); // Adjust the path as necessary
const router = express.Router();

// POST endpoint to save crop data
router.post("/", async (req, res) => {
  try {
    console.log(req.body);

    const { humidity, temperature, rain, moisture, fieldNumber } = req.body;

    // Create a new crop entry
    const newCrop = new Crop({
      humidity,
      temperature,
      rain,
      moisture,
      fieldNumber,
    });

    // Save the crop to the database
    await newCrop.save();

    return res
      .status(201)
      .json({ message: "Crop data saved successfully!", data: newCrop });
  } catch (error) {
    console.error("Error saving crop data:", error.message);
    return res
      .status(500)
      .json({ message: "Error saving crop data", error: error.message });
  }
});

// GET endpoint to fetch the last inserted crop based on fieldNumber
router.get("/:fieldNumber", async (req, res) => {
  try {
    const { fieldNumber } = req.params;

    // Find the most recent crop entry for the given fieldNumber
    const crop = await Crop.findOne({ fieldNumber })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .exec();

    if (!crop) {
      return res.status(404).json({ message: "No crop data found" });
    }

    return res.status(200).json(crop);
  } catch (error) {
    console.error("Error fetching crop data:", error.message);
    return res
      .status(500)
      .json({ message: "Error fetching crop data", error: error.message });
  }
});

module.exports = router;
