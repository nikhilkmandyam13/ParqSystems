const mongoose = require("mongoose");


const customerTrendsSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    vehicleCount: { type: Number, required: true },
    averageExpenditure: { type: Number, required: true }
});

module.exports = mongoose.model("CustomerTrends", customerTrendsSchema, "CustomerTrends");