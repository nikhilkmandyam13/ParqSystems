const mongoose = require("mongoose");


const parkingSchema = new mongoose.Schema({
    isMultiLevel: Boolean,
    parking: Array,
    emptySlotsCount: Number,
    occupiedSlotsCount: Number
});


module.exports = mongoose.model("Parking", parkingSchema,"ParkingSlots");