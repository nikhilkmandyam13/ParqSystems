const ParkingSlots = require("../Models/ParkingSlots.js");
const CustomerTrends = require("../Models/CustomerTrends.js");


async function getCustomerTrends() {
    try {
        return await CustomerTrends.find().sort({ date: 1 });
    }
    catch (error) {
        throw new Error("An error occured while fetching customer trends data : " + error);
    }
}

async function addCustomerTrend(data) {
    try {
        const newEntry = new CustomerTrends(data);
        return await newEntry.save();
    }
    catch (error) {
        throw new Error("An error occured while adding customer trend : " + error);
    }
}


async function updateParkingSlots(data) {
  try {
    console.log("🛰️ Incoming parking data:", data);
    const result = await ParkingSlots.findOneAndUpdate(
      {},
      { $set: { parking: data } },
      { new: true, upsert: true }
    );
    console.log("✅ Updated ParkingSlots:", result);
    return result;
  } catch (error) {
    console.error("❌ Error updating parking slots:", error);
    throw new Error("An error occurred while updating parking slots: " + error);
  }
}



module.exports = {
    getCustomerTrends,
    addCustomerTrend,
    updateParkingSlots
}



