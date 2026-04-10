const express = require("express");
const router = express.Router();

const {
    getCustomerTrends,
    addCustomerTrend,
    updateParkingSlots
} = require("../Services/AdminServices.js");


router.get("/getCustomerTrends", async (req, res) => {
    try {
        const customerTrends = await getCustomerTrends();
        res.status(200).json(customerTrends);
    }
    catch (error) {
        res.status(500).json({ message: "An error occured while fetching customer data", errorMessage: error.message });
    }
});


router.post("/addCustomerTrend", async (req, res) => {
    try {
        const newTrend = await addCustomerTrend(req.body);
        res.status(200).json(newTrend);
    }
    catch (error) {
        res.status(500).json({ message: "An error occured while adding customer trend", errorMessage: error.message });
    }
});


router.put("/updateParkingSlots", async (req, res) => {
    try {
        const newParkingSlots = await updateParkingSlots(req.body);
        res.status(200).json(newParkingSlots);
    }
    catch (error) {
        res.status(500).json({ message: "An error occured while updating level name(s)/shop(s)", errorMessage: error.message });
    }
});



module.exports =  router ;