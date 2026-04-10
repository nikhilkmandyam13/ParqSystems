const express = require("express");
const router = express.Router();
const Parking = require("../Models/ParkingSlots.js");


router.get("/parking-status", async (req, res) => {
    try {
        const data = await Parking.findOne();
        console.log("Data from database : " + data);
        if (data) {
            res.json(data);
        }
        else {
            res.status(404).json({ message: "Parking data not found! Try again" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "An error occured while loading parking data. Try again", error });
    }
});


module.exports = router;