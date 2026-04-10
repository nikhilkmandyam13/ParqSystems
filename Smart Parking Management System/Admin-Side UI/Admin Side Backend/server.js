const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");


const ParkingSlots = require("./Models/ParkingSlots.js");
const CustomerTrends = require("./Models/CustomerTrends.js");


const ParkingSlotRoutes = require("./Routes/ParkingRoutes.js");
const AdminRoutes = require("./Routes/AdminRoutes.js");


const app = express();
app.use(cors());
app.use(express.json());


const server = http.createServer(app);


mongoose.connect("mongodb+srv://KanishkSanadi:Ludovico@kanishks-cluster.imvlvbw.mongodb.net/Smart-Parking-System?retryWrites=true&w=majority&appName=Kanishks-Cluster", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to database successfully");
}).catch((error) => {
    console.log("An error occured while connecting to database : " + error);
});

const io = new Server(server, {
    cors: {
        origin: "*",
        methods:["GET","POST","PUT"]
    }
});


io.on("connection", (socket) => {
    console.log("Connection via WebSocket established");


    socket.on("parkingUpdate", async () => {
        try {
            const parkingSlots = await ParkingSlots.findOne();
            socket.emit("parkingUpdate", parkingSlots);
        }
        catch (error) {
            console.log("An error occured while sending parking update : " + error);
            socket.emit("parkingUpdateError", "An error occured while sending parking slot updates");
        }
    });




    socket.on("customerTrendsUpdate", async () => {
        try {
            const customerTrends = await CustomerTrends.find().sort({date:1});
            socket.emit("customerTrendsUpdate", customerTrends);
        }
        catch (error) {
            console.log("An error occured while sending customer data : " + error);
            socket.emit("customerTrendsUpdateError", "An error occured while sending customer data");
        }
    });



    socket.on("disconnect", () => {
        console.log("Connection via WebSocket terminated");
    })
});



// app.get("/api/admin/test", (req, res) => {
//     res.json({ message: "Admin side backend has been activated" });
// });



app.use("/admin", AdminRoutes);
app.use("/parkingslots", ParkingSlotRoutes);




server.listen(4000, () => {
    console.log("Backend running successfully");
})